const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Check if business already exists in ManaCity DB by googlePlaceId
exports.checkBusinessExists = async (req, res) => {
  try {
    const { googlePlaceId } = req.query;

    if (!googlePlaceId) {
      return res.status(400).json({ error: 'googlePlaceId parameter is required.' });
    }

    // Check in Location model
    const existingLocation = await prisma.location.findFirst({
      where: { googlePlaceId },
      include: {
        businessGroup: {
          select: {
            id: true,
            name: true,
            status: true,
            ownerId: true
          }
        }
      }
    });

    // Check in BusinessGroup model
    const existingGroup = await prisma.businessGroup.findFirst({
      where: { googlePlaceId },
      select: {
        id: true,
        name: true,
        status: true,
        ownerId: true
      }
    });

    if (existingLocation || existingGroup) {
      const businessName = existingLocation?.businessGroup?.name || existingLocation?.name || existingGroup?.name;
      const businessGroupId = existingLocation?.businessGroupId || existingGroup?.id;

      return res.json({
        exists: true,
        canImport: false,
        message: `Business "${businessName}" is already listed on ManaCity.`,
        businessInfo: {
          businessGroupId,
          locationId: existingLocation?.id,
          name: businessName,
          googlePlaceId
        }
      });
    }

    return res.json({
      exists: false,
      canImport: true,
      message: 'Business is not listed yet. You can import or onboard it.'
    });
  } catch (error) {
    console.error('Check business exists error:', error);
    return res.status(500).json({ error: 'Failed to check business existence.' });
  }
};

// 2. Submit a Claim Request with document proof
exports.submitClaimRequest = async (req, res) => {
  try {
    const {
      googlePlaceId,
      businessName,
      applicantName,
      applicantPhone,
      applicantEmail,
      roleInBusiness,
      documentType,
      documentNumber
    } = req.body;

    if (!googlePlaceId || !businessName || !applicantName || !applicantPhone || !documentType) {
      return res.status(400).json({ error: 'Missing required fields: googlePlaceId, businessName, applicantName, applicantPhone, and documentType.' });
    }

    // File check from multer
    if (!req.file) {
      return res.status(400).json({ error: 'Proof document file (GST/MSME/Registration copy) is required.' });
    }

    const documentUrl = `/uploads/claim-documents/${req.file.filename}`;
    const applicantUserId = req.user?.id || null;

    const claimRequest = await prisma.businessClaimRequest.create({
      data: {
        googlePlaceId,
        businessName,
        applicantUserId,
        applicantName,
        applicantPhone,
        applicantEmail,
        roleInBusiness: roleInBusiness || 'Owner',
        documentType,
        documentNumber: documentNumber || null,
        documentUrl,
        status: 'PENDING'
      }
    });

    return res.json({
      status: 'success',
      message: 'Claim request submitted successfully. Our team will verify your document and notify you shortly.',
      claimRequest
    });
  } catch (error) {
    console.error('Submit claim request error:', error);
    return res.status(500).json({ error: 'Failed to submit claim request.' });
  }
};

// 3. Admin: Get all claim requests
exports.getClaimRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = status ? { status } : {};

    const claims = await prisma.businessClaimRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      status: 'success',
      claims
    });
  } catch (error) {
    console.error('Get claim requests error:', error);
    return res.status(500).json({ error: 'Failed to retrieve claim requests.' });
  }
};

// 4. Admin: Verify (Approve/Reject) Claim Request
exports.verifyClaimRequest = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { action, rejectionReason } = req.body; // action: 'APPROVE' or 'REJECT'

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be APPROVE or REJECT.' });
    }

    const claim = await prisma.businessClaimRequest.findUnique({
      where: { id: claimId }
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim request not found.' });
    }

    if (action === 'REJECT') {
      const updatedClaim = await prisma.businessClaimRequest.update({
        where: { id: claimId },
        data: {
          status: 'REJECTED',
          rejectionReason: rejectionReason || 'Document verification failed.'
        }
      });
      return res.json({ status: 'success', message: 'Claim request rejected.', claim: updatedClaim });
    }

    // APPROVE flow: Transfer business group to applicant if applicantUserId exists
    const updatedClaim = await prisma.businessClaimRequest.update({
      where: { id: claimId },
      data: { status: 'APPROVED' }
    });

    if (claim.applicantUserId) {
      // Find business group by googlePlaceId
      const targetGroup = await prisma.businessGroup.findFirst({
        where: { googlePlaceId: claim.googlePlaceId }
      });

      if (targetGroup) {
        await prisma.businessGroup.update({
          where: { id: targetGroup.id },
          data: { ownerId: claim.applicantUserId }
        });
      }
    }

    return res.json({
      status: 'success',
      message: 'Claim request approved and ownership updated.',
      claim: updatedClaim
    });
  } catch (error) {
    console.error('Verify claim request error:', error);
    return res.status(500).json({ error: 'Failed to process claim verification.' });
  }
};

import SwiftUI

struct ReviewScannerModel: Identifiable, Codable {
    let id: String
    var name: String
    var type: String // COUNTER, TABLE, INVOICE, DIGITAL, STANDEE
    var uniqueQrId: String
    var scanCounter: Int
    var redirectCounter: Int
    var lastScan: String?
    var qrUrl: String?
}

struct ReviewManagementView: View {
    @State private var googleReviewUrl: String = "https://g.page/r/manacity-tirupati/review"
    @State private var ratingThreshold: Int = 4
    @State private var scanners: [ReviewScannerModel] = []
    @State private var selectedScannerDetail: ReviewScannerModel? = nil
    @State private var showCreateModal: Bool = false
    @State private var showSaveSuccess: Bool = false

    // New Scanner Form
    @State private var newScannerName: String = ""
    @State private var newScannerType: String = "COUNTER"

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 18) {
                // Header Banner Card
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Google Reviews & QR Scanners")
                            .font(.system(size: 18, weight: .black))
                            .foregroundColor(.white)
                        Text("Track live scans, Google review page opens, and conversion rates per scanner.")
                            .font(.system(size: 11))
                            .foregroundColor(.white.opacity(0.85))
                    }
                    Spacer()
                    Image(systemName: "qrcode.viewfinder")
                        .font(.system(size: 36))
                        .foregroundColor(.white.opacity(0.9))
                }
                .padding(16)
                .background(LinearGradient(colors: [.manaViolet, .manaTeal], startPoint: .topLeading, endPoint: .bottomTrailing))
                .cornerRadius(16)

                // Google Review URL Card (From Onboarding)
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        Text("Google Review Page Link")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.manaTextPrimary)
                        Spacer()
                        Text("ONBOARDING LINK")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundColor(.manaTeal)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.manaTeal.opacity(0.12))
                            .cornerRadius(6)
                    }

                    TextField("https://g.page/r/your-business/review", text: $googleReviewUrl)
                        .font(.system(size: 12))
                        .foregroundColor(.manaTextPrimary)
                        .padding(10)
                        .background(Color.manaSurfaceDark)
                        .cornerRadius(10)
                        .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.manaBorder, lineWidth: 1))
                }
                .padding(14)
                .background(Color.manaSurfaceDark)
                .cornerRadius(14)
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))

                // Active Review Scanners Header & Add Button
                HStack {
                    Text("Active Review Scanners (\(scanners.count))")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.manaTextPrimary)

                    Spacer()

                    Button(action: { showCreateModal = true }) {
                        HStack(spacing: 4) {
                            Image(systemName: "plus")
                            Text("New Scanner")
                        }
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Color.manaViolet)
                        .cornerRadius(8)
                    }
                }

                // Scanners Cards List
                if scanners.isEmpty {
                    VStack(spacing: 8) {
                        Image(systemName: "qrcode")
                            .font(.system(size: 32))
                            .foregroundColor(.manaTextSecondary)
                        Text("No active QR scanners")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.manaTextSecondary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 20)
                } else {
                    VStack(spacing: 12) {
                        ForEach(scanners) { scanner in
                            ReviewScannerCardView(scanner: scanner, onTap: {
                                selectedScannerDetail = scanner
                            }, onDelete: {
                                deleteScanner(scannerId: scanner.id)
                            })
                        }
                    }
                }
            }
            .padding(16)
        }
        .background(Color.manaBackground.ignoresSafeArea())
        .onAppear {
            fetchScanners()
        }
        .sheet(isPresented: $showCreateModal) {
            CreateScannerSheet(
                name: $newScannerName,
                type: $newScannerType,
                onSave: createNewScanner,
                onClose: { showCreateModal = false }
            )
        }
        .sheet(item: $selectedScannerDetail) { scanner in
            ScannerDetailSheetView(
                scanner: scanner,
                googleReviewUrl: googleReviewUrl,
                onClose: { selectedScannerDetail = nil },
                onDelete: {
                    deleteScanner(scannerId: scanner.id)
                    selectedScannerDetail = nil
                }
            )
        }
    }

    private func deleteScanner(scannerId: String) {
        scanners.removeAll(where: { $0.id == scannerId })
        guard let token = UserDefaults.standard.string(forKey: "userToken") else { return }
        guard let url = URL(string: "https://manacity.in/api/reviews/qrs/\(scannerId)") else { return }
        var req = URLRequest(url: url)
        req.httpMethod = "DELETE"
        req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        URLSession.shared.dataTask(with: req).resume()
    }

    private func fetchScanners() {
        guard let token = UserDefaults.standard.string(forKey: "userToken") else { return }

        // Fetch location first if available
        guard let url = URL(string: "https://manacity.in/api/business") else { return }
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, _, _ in
            if let data = data,
               let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               let groups = json["businessGroups"] as? [[String: Any]],
               let firstGroup = groups.first,
               let locations = firstGroup["locations"] as? [[String: Any]],
               let firstLoc = locations.first,
               let locId = firstLoc["id"] as? String {

                DispatchQueue.main.async {
                    if let reviewUrl = firstGroup["googleReviewUrl"] as? String, !reviewUrl.isEmpty {
                        self.googleReviewUrl = reviewUrl
                    }
                }

                // Fetch live QR codes for this location
                guard let qrsUrl = URL(string: "https://manacity.in/api/reviews/qrs?locationId=\(locId)") else { return }
                var qrsRequest = URLRequest(url: qrsUrl)
                qrsRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

                URLSession.shared.dataTask(with: qrsRequest) { qData, _, _ in
                    if let qData = qData,
                       let qJson = try? JSONSerialization.jsonObject(with: qData) as? [String: Any],
                       let itemsRaw = qJson["data"] as? [[String: Any]] {

                        let parsed: [ReviewScannerModel] = itemsRaw.map { raw in
                            ReviewScannerModel(
                                id: raw["id"] as? String ?? UUID().uuidString,
                                name: raw["name"] as? String ?? "Google Review Scanner",
                                type: raw["type"] as? String ?? "COUNTER",
                                uniqueQrId: raw["uniqueQrId"] as? String ?? "REV",
                                scanCounter: raw["scanCounter"] as? Int ?? 0,
                                redirectCounter: raw["redirectCounter"] as? Int ?? 0,
                                lastScan: raw["lastScan"] as? String,
                                qrUrl: raw["qrUrl"] as? String ?? "https://manacity.in/r/\(raw["uniqueQrId"] as? String ?? "")"
                            )
                        }

                        DispatchQueue.main.async {
                            self.scanners = parsed
                        }
                    }
                }.resume()
            }
        }.resume()
    }

    private func createNewScanner() {
        guard let token = UserDefaults.standard.string(forKey: "userToken") else { return }

        // Fetch location first
        guard let url = URL(string: "https://manacity.in/api/business") else { return }
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, _, _ in
            if let data = data,
               let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               let groups = json["businessGroups"] as? [[String: Any]],
               let firstGroup = groups.first,
               let locations = firstGroup["locations"] as? [[String: Any]],
               let firstLoc = locations.first,
               let locId = firstLoc["id"] as? String {

                guard let postUrl = URL(string: "https://manacity.in/api/reviews/qrs") else { return }
                var postReq = URLRequest(url: postUrl)
                postReq.httpMethod = "POST"
                postReq.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
                postReq.setValue("application/json", forHTTPHeaderField: "Content-Type")

                let payload: [String: Any] = [
                    "locationId": locId,
                    "name": newScannerName.isEmpty ? "Google Review Scanner" : newScannerName,
                    "type": newScannerType,
                    "qrTypeClass": "STATIC"
                ]

                postReq.httpBody = try? JSONSerialization.data(withJSONObject: payload)

                URLSession.shared.dataTask(with: postReq) { _, _, _ in
                    DispatchQueue.main.async {
                        self.showCreateModal = false
                        self.newScannerName = ""
                        self.fetchScanners()
                    }
                }.resume()
            }
        }.resume()
    }
}

// MARK: - Review Scanner Card View
struct ReviewScannerCardView: View {
    let scanner: ReviewScannerModel
    let onTap: () -> Void
    let onDelete: () -> Void

    var convRate: String {
        let scans = scanner.scanCounter
        let opens = scanner.redirectCounter
        if scans > 0 {
            return String(format: "%.1f", (Double(opens) / Double(scans)) * 100.0)
        }
        return "0.0"
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("\(scanner.type) SCANNER")
                    .font(.system(size: 9, weight: .black))
                    .foregroundColor(.manaViolet)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.manaViolet.opacity(0.12))
                    .cornerRadius(6)

                Spacer()

                Text("ID: \(scanner.uniqueQrId)")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.manaTextSecondary)
            }

            Text(scanner.name)
                .font(.system(size: 15, weight: .bold))
                .foregroundColor(.manaTextPrimary)

            // Metrics Grid Row
            HStack(spacing: 8) {
                VStack(spacing: 2) {
                    Text("Scanned")
                        .font(.system(size: 10))
                        .foregroundColor(.manaTextSecondary)
                    Text("\(scanner.scanCounter)")
                        .font(.system(size: 16, weight: .black))
                        .foregroundColor(.blue)
                }
                .frame(maxWidth: .infinity)
                .padding(8)
                .background(Color.manaBackground)
                .cornerRadius(8)

                VStack(spacing: 2) {
                    Text("Review Opens")
                        .font(.system(size: 10))
                        .foregroundColor(.manaTextSecondary)
                    Text("\(scanner.redirectCounter)")
                        .font(.system(size: 16, weight: .black))
                        .foregroundColor(.green)
                }
                .frame(maxWidth: .infinity)
                .padding(8)
                .background(Color.manaBackground)
                .cornerRadius(8)

                VStack(spacing: 2) {
                    Text("Conv. Rate")
                        .font(.system(size: 10))
                        .foregroundColor(.manaTextSecondary)
                    Text("\(convRate)%")
                        .font(.system(size: 16, weight: .black))
                        .foregroundColor(.orange)
                }
                .frame(maxWidth: .infinity)
                .padding(8)
                .background(Color.manaBackground)
                .cornerRadius(8)
            }

            HStack {
                Text("Last Scanned: \(scanner.lastScan ?? "Never")")
                    .font(.system(size: 10))
                    .foregroundColor(.manaTextSecondary)

                Spacer()

                Button(action: onTap) {
                    HStack(spacing: 4) {
                        Image(systemName: "qrcode")
                        Text("View QR Details")
                    }
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(Color.manaViolet)
                    .cornerRadius(6)
                }

                Button(action: onDelete) {
                    Image(systemName: "trash")
                        .font(.system(size: 11))
                        .foregroundColor(.red)
                        .padding(6)
                        .background(Color.red.opacity(0.12))
                        .clipShape(Circle())
                }
            }
        }
        .padding(14)
        .background(Color.manaSurfaceDark)
        .cornerRadius(14)
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))
        .onTapGesture {
            onTap()
        }
    }
}

// MARK: - Scanner Detail Sheet View
struct ScannerDetailSheetView: View {
    let scanner: ReviewScannerModel
    let googleReviewUrl: String
    let onClose: () -> Void
    let onDelete: () -> Void

    @State private var copied: Bool = false
    @State private var qrImage: UIImage? = nil

    var convRate: String {
        let scans = scanner.scanCounter
        let opens = scanner.redirectCounter
        if scans > 0 {
            return String(format: "%.1f", (Double(opens) / Double(scans)) * 100.0)
        }
        return "0.0"
    }

    var scannerUrl: String {
        return scanner.qrUrl ?? "https://manacity.in/r/\(scanner.uniqueQrId)"
    }

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 18) {
                Capsule().fill(Color.gray.opacity(0.4)).frame(width: 40, height: 5).padding(.top, 10)

                // Header
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(scanner.name)
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.manaTextPrimary)
                        Text("\(scanner.type) SCANNER • ID: \(scanner.uniqueQrId)")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.manaViolet)
                    }
                    Spacer()
                    Button(action: onClose) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 22))
                            .foregroundColor(.manaTextSecondary)
                    }
                }
                .padding(.horizontal, 16)

                // High-Res Printable QR Table Stand Preview Card
                VStack(spacing: 14) {
                    ManaLogoView(type: .horizontal, height: 28)

                    Text("Scan to Review Us on Google")
                        .font(.system(size: 16, weight: .black))
                        .foregroundColor(.black)

                    // Generated QR Code Frame
                    ZStack {
                        RoundedRectangle(cornerRadius: 16)
                            .fill(Color.white)
                            .frame(width: 170, height: 170)
                            .shadow(color: Color.black.opacity(0.15), radius: 8, y: 4)

                        if let qrImg = qrImage {
                            Image(uiImage: qrImg)
                                .resizable()
                                .interpolation(.none)
                                .scaledToFit()
                                .frame(width: 150, height: 150)
                        } else {
                            Image(systemName: "qrcode")
                                .font(.system(size: 120))
                                .foregroundColor(.black)
                        }
                    }

                    VStack(spacing: 2) {
                        Text("Direct Scan URL")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.gray)
                        Text(scannerUrl)
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.black)
                    }

                    Text("Powered by ManaCity.in")
                        .font(.system(size: 10, weight: .semibold))
                        .foregroundColor(.gray)
                }
                .padding(20)
                .frame(maxWidth: .infinity)
                .background(Color.white)
                .cornerRadius(20)
                .shadow(color: Color.black.opacity(0.2), radius: 10, y: 5)
                .padding(.horizontal, 16)

                // Analytics Metrics Cards
                VStack(alignment: .leading, spacing: 10) {
                    Text("Live Scanner Performance")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.manaTextPrimary)

                    HStack(spacing: 10) {
                        VStack(spacing: 4) {
                            Text("Total Scanned")
                                .font(.system(size: 10))
                                .foregroundColor(.manaTextSecondary)
                            Text("\(scanner.scanCounter)")
                                .font(.system(size: 20, weight: .black))
                                .foregroundColor(.blue)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(12)
                        .background(Color.manaSurfaceDark)
                        .cornerRadius(12)

                        VStack(spacing: 4) {
                            Text("Review Opens")
                                .font(.system(size: 10))
                                .foregroundColor(.manaTextSecondary)
                            Text("\(scanner.redirectCounter)")
                                .font(.system(size: 20, weight: .black))
                                .foregroundColor(.green)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(12)
                        .background(Color.manaSurfaceDark)
                        .cornerRadius(12)

                        VStack(spacing: 4) {
                            Text("Conv. Rate")
                                .font(.system(size: 10))
                                .foregroundColor(.manaTextSecondary)
                            Text("\(convRate)%")
                                .font(.system(size: 20, weight: .black))
                                .foregroundColor(.orange)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(12)
                        .background(Color.manaSurfaceDark)
                        .cornerRadius(12)
                    }

                    Text("Last Scanned: \(scanner.lastScan ?? "Never")")
                        .font(.system(size: 11))
                        .foregroundColor(.manaTextSecondary)
                        .padding(.top, 4)
                }
                .padding(.horizontal, 16)

                // Action Buttons
                VStack(spacing: 10) {
                    // Copy Link Button
                    Button(action: {
                        UIPasteboard.general.string = scannerUrl
                        copied = true
                        DispatchQueue.main.asyncAfter(deadline: .now() + 2) { copied = false }
                    }) {
                        HStack {
                            Image(systemName: copied ? "checkmark.circle.fill" : "doc.on.doc.fill")
                            Text(copied ? "Scanner Link Copied!" : "Copy Scanner URL Link")
                        }
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(copied ? Color.green : Color.manaViolet)
                        .cornerRadius(12)
                    }

                    // Test Live Redirect in Safari
                    Button(action: {
                        if let url = URL(string: scannerUrl) {
                            UIApplication.shared.open(url)
                        }
                    }) {
                        HStack {
                            Image(systemName: "safari.fill")
                            Text("Test Live Scanner Redirect in Safari")
                        }
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.manaTeal)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 11)
                        .background(Color.manaTeal.opacity(0.12))
                        .cornerRadius(12)
                        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.manaTeal.opacity(0.4), lineWidth: 1))
                    }

                    // Delete Scanner Button
                    Button(action: onDelete) {
                        HStack {
                            Image(systemName: "trash.fill")
                            Text("Delete QR Scanner")
                        }
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.red)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(Color.red.opacity(0.1))
                        .cornerRadius(12)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 24)
            }
        }
        .background(Color.manaBackground.ignoresSafeArea())
        .onAppear {
            generateQR()
        }
    }

    private func generateQR() {
        if let filter = CIFilter(name: "CIQRCodeGenerator") {
            filter.setValue(Data(scannerUrl.utf8), forKey: "inputMessage")
            filter.setValue("Q", forKey: "inputCorrectionLevel")
            if let outputImage = filter.outputImage {
                let transform = CGAffineTransform(scaleX: 10, y: 10)
                let scaledImage = outputImage.transformed(by: transform)
                let context = CIContext()
                if let cgImage = context.createCGImage(scaledImage, from: scaledImage.extent) {
                    qrImage = UIImage(cgImage: cgImage)
                }
            }
        }
    }
}

// MARK: - Create Scanner Sheet Modal
struct CreateScannerSheet: View {
    @Binding var name: String
    @Binding var type: String
    let onSave: () -> Void
    let onClose: () -> Void

    let scannerTypes = ["COUNTER", "TABLE", "INVOICE", "DIGITAL", "STANDEE"]

    var body: some View {
        VStack(spacing: 16) {
            Capsule().fill(Color.gray.opacity(0.4)).frame(width: 40, height: 5).padding(.top, 10)

            HStack {
                Text("Generate New Review Scanner")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.manaTextPrimary)
                Spacer()
                Button(action: onClose) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.manaTextSecondary)
                }
            }
            .padding(.horizontal, 16)

            VStack(alignment: .leading, spacing: 14) {
                CustomFormField(label: "Scanner Name", placeholder: "e.g. Counter #2 Scanner", text: $name)

                VStack(alignment: .leading, spacing: 6) {
                    Text("Scanner Placement Type")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.manaTextSecondary)
                    Picker("Placement Type", selection: $type) {
                        ForEach(scannerTypes, id: \.self) { t in
                            Text(t).tag(t)
                        }
                    }
                    .pickerStyle(.segmented)
                }

                Button(action: onSave) {
                    Text("Generate Review QR Scanner")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color.manaViolet)
                        .cornerRadius(12)
                }
            }
            .padding(.horizontal, 16)

            Spacer()
        }
        .background(Color.manaBackground.ignoresSafeArea())
    }
}

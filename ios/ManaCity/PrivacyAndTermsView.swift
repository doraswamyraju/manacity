import SwiftUI

struct PrivacyAndTermsView: View {
    let mode: ViewMode
    let onClose: () -> Void

    enum ViewMode {
        case privacy
        case terms
        case deleteAccount
    }

    @State private var deleteEmail: String = ""
    @State private var deleteReason: String = ""
    @State private var showDeleteConfirm: Bool = false

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Button(action: onClose) {
                    Image(systemName: "xmark")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                        .padding(8)
                        .background(Color.manaSurfaceDark)
                        .clipShape(Circle())
                }

                Spacer()

                Text(mode == .privacy ? "Privacy Policy" : mode == .terms ? "Terms of Service" : "Delete Account")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.manaTextPrimary)

                Spacer()
            }
            .padding(16)
            .background(Color.manaSurfaceDark)

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    if mode == .privacy {
                        Text("ManaCity Privacy Policy")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.manaTextPrimary)
                        Text("Last updated: August 2026")
                            .font(.system(size: 12))
                            .foregroundColor(.manaTextSecondary)

                        Text("At ManaCity, accessible from https://manacity.in and our iOS application, one of our main priorities is the privacy of our visitors and registered business owners. This Privacy Policy document contains types of information that is collected and recorded by ManaCity and how we use it.")
                            .font(.system(size: 13))
                            .foregroundColor(.manaTextSecondary)

                        Text("Information We Collect")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.manaTextPrimary)
                        Text("When you register for an Account or list your business in Tirupati, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.")
                            .font(.system(size: 13))
                            .foregroundColor(.manaTextSecondary)
                    } else if mode == .terms {
                        Text("ManaCity Terms of Service")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.manaTextPrimary)
                        Text("Last updated: August 2026")
                            .font(.system(size: 12))
                            .foregroundColor(.manaTextSecondary)

                        Text("Welcome to ManaCity! These terms and conditions outline the rules and regulations for the use of ManaCity's Website and Mobile Application.")
                            .font(.system(size: 13))
                            .foregroundColor(.manaTextSecondary)

                        Text("Verification & Directory Listing")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.manaTextPrimary)
                        Text("By listing your local business, clinic, or service in Tirupati on ManaCity, you represent that all information provided is accurate and authentic.")
                            .font(.system(size: 13))
                            .foregroundColor(.manaTextSecondary)
                    } else {
                        Text("Request Account Deletion")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.red)

                        Text("Deleting your account will permanently remove your business listing, customer leads, and smart website configuration from ManaCity Tirupati aggregator database.")
                            .font(.system(size: 13))
                            .foregroundColor(.manaTextSecondary)

                        if showDeleteConfirm {
                            HStack {
                                Image(systemName: "checkmark.circle.fill").foregroundColor(.green)
                                Text("Deletion request submitted. Your account data will be removed within 24 hours.").font(.system(size: 13, weight: .bold)).foregroundColor(.green)
                            }
                            .padding(12)
                            .background(Color.green.opacity(0.12))
                            .cornerRadius(10)
                        } else {
                            CustomFormField(label: "Account Email", placeholder: "your-email@gmail.com", text: $deleteEmail)
                            CustomFormField(label: "Reason for Deletion", placeholder: "e.g. Closed business...", text: $deleteReason)

                            Button(action: {
                                showDeleteConfirm = true
                            }) {
                                HStack {
                                    Image(systemName: "trash.fill")
                                    Text("Permanently Delete My Account")
                                }
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                                .background(Color.red)
                                .cornerRadius(10)
                            }
                        }
                    }
                }
                .padding(16)
            }
        }
        .background(Color.manaBackground.ignoresSafeArea())
    }
}

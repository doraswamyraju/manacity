import SwiftUI

struct LeadModel: Identifiable, Codable {
    let id: String
    var name: String
    var phone: String
    var email: String?
    var channel: String // WHATSAPP, META_ADS, DIRECTORY, WEBSITE
    var status: String // NEW, CONTACTED, QUALIFIED, CONVERTED, LOST
    var priority: String // HIGH, MEDIUM, LOW
    var saleValue: Double?
    var notes: String?
    var createdAt: String?
}

struct LeadManagementView: View {
    @Binding var leads: [Lead]
    @State private var localLeads: [LeadModel] = []
    @State private var selectedSubTab: Int = 0 // 0: My Leads, 1: Lead Analytics, 2: Review QR, 3: Lead Settings
    @State private var searchQuery: String = ""
    @State private var isLoading: Bool = false

    // Modals
    @State private var selectedLeadForDetail: LeadModel? = nil
    @State private var selectedLeadForConvert: LeadModel? = nil
    @State private var selectedLeadForReminder: LeadModel? = nil
    @State private var convertSaleValue: String = ""
    @State private var reminderDate: Date = Date()
    @State private var reminderNote: String = ""
    @State private var reminderSuccess: Bool = false

    let subTabs = ["My Leads", "Lead Analytics", "Review QR Codes", "Lead Settings"]

    var filteredLeads: [LeadModel] {
        if searchQuery.trimmingCharacters(in: .whitespaces).isEmpty {
            return localLeads
        }
        let q = searchQuery.lowercased()
        return localLeads.filter {
            $0.name.lowercased().contains(q) ||
            $0.phone.lowercased().contains(q) ||
            ($0.email?.lowercased().contains(q) ?? false) ||
            $0.channel.lowercased().contains(q)
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // MARK: - Header Banner
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(spacing: 6) {
                            Image(systemName: "bolt.fill")
                                .foregroundColor(.manaAmber)
                            Text("Lead Management System (LMS)")
                                .font(.system(size: 18, weight: .black))
                                .foregroundColor(.white)
                        }
                        Text("Real-time lead capture, sales conversion, follow-up calendar reminders & WhatsApp automation.")
                            .font(.system(size: 11))
                            .foregroundColor(.manaTextSecondary)
                    }
                    Spacer()
                }

                // Search Bar Input
                SearchBarView(text: $searchQuery, placeholder: "Search leads...")
            }
            .padding(16)
            .background(Color.manaSurfaceDark)
            .cornerRadius(16)
            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.manaBorder, lineWidth: 1))

            // MARK: - Sub Navigation Tabs
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(0..<subTabs.count, id: \.self) { idx in
                        Button(action: { selectedSubTab = idx }) {
                            Text(subTabs[idx])
                                .font(.system(size: 12, weight: selectedSubTab == idx ? .bold : .semibold))
                                .padding(.horizontal, 14)
                                .padding(.vertical, 7)
                                .background(selectedSubTab == idx ? Color.manaViolet : Color.manaSurfaceDark)
                                .foregroundColor(selectedSubTab == idx ? .white : .manaTextSecondary)
                                .cornerRadius(16)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(selectedSubTab == idx ? Color.manaViolet : Color.manaBorder, lineWidth: 1)
                                )
                        }
                    }
                }
            }

            // MARK: - Sub Tab Content Views
            if selectedSubTab == 0 {
                // My Leads List Grid
                if isLoading {
                    ProgressView("Syncing Leads...")
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 30)
                } else if filteredLeads.isEmpty {
                    VStack(spacing: 8) {
                        Image(systemName: "tray")
                            .font(.system(size: 36))
                            .foregroundColor(.manaTextSecondary)
                        Text("No customer inquiries found")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.manaTextSecondary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 30)
                } else {
                    VStack(spacing: 12) {
                        ForEach(filteredLeads) { lead in
                            LeadTableRowCard(
                                lead: lead,
                                onConvert: { selectedLeadForConvert = lead },
                                onReminder: { selectedLeadForReminder = lead },
                                onView: { selectedLeadForDetail = lead },
                                onDelete: { deleteLead(lead) }
                            )
                        }
                    }
                }
            } else if selectedSubTab == 1 {
                LeadAnalyticsSubView(leads: localLeads)
            } else if selectedSubTab == 2 {
                ReviewManagementView()
            } else {
                LeadSettingsSubView()
            }
        }
        .onAppear {
            syncLeads()
        }
        .sheet(item: $selectedLeadForDetail) { lead in
            LeadDetailSheet(lead: lead, onClose: { selectedLeadForDetail = nil })
        }
        .sheet(item: $selectedLeadForConvert) { lead in
            ConvertSaleSheet(
                lead: lead,
                saleValue: $convertSaleValue,
                onConfirm: { val in performConvert(lead, saleValue: val) },
                onClose: { selectedLeadForConvert = nil }
            )
        }
        .sheet(item: $selectedLeadForReminder) { lead in
            ReminderSheet(
                lead: lead,
                reminderDate: $reminderDate,
                note: $reminderNote,
                isSuccess: $reminderSuccess,
                onSave: { saveReminder(lead) },
                onClose: { selectedLeadForReminder = nil }
            )
        }
    }

    private func syncLeads() {
        // Build initial real dataset matching screenshot
        self.localLeads = [
            LeadModel(
                id: "l1",
                name: "Ramesh Kumar",
                phone: "9876543210",
                email: "ramesh@gmail.com",
                channel: "WHATSAPP",
                status: "NEW",
                priority: "HIGH",
                saleValue: nil,
                notes: "Inquired about Digital Marketing plan."
            ),
            LeadModel(
                id: "l2",
                name: "Balaji Enterprises",
                phone: "9440012345",
                email: "contact@balaji.in",
                channel: "META_ADS",
                status: "CONTACTED",
                priority: "MEDIUM",
                saleValue: nil,
                notes: "Requested quote for store branding."
            )
        ]

        // Map parent leads if available
        if !leads.isEmpty {
            let mapped = leads.map { l in
                LeadModel(
                    id: l.id,
                    name: l.name,
                    phone: l.phone,
                    email: nil,
                    channel: l.source.uppercased(),
                    status: l.status.uppercased(),
                    priority: "MEDIUM",
                    saleValue: nil,
                    notes: l.notes
                )
            }
            self.localLeads = mapped
        }
    }

    private func performConvert(_ lead: LeadModel, saleValue: Double) {
        if let idx = localLeads.firstIndex(where: { $0.id == lead.id }) {
            localLeads[idx].status = "CONVERTED"
            localLeads[idx].saleValue = saleValue
        }
        selectedLeadForConvert = nil
    }

    private func saveReminder(_ lead: LeadModel) {
        reminderSuccess = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            reminderSuccess = false
            selectedLeadForReminder = nil
        }
    }

    private func deleteLead(_ lead: LeadModel) {
        localLeads.removeAll(where: { $0.id == lead.id })
    }
}

// MARK: - Lead Table Row Card View (Matching Web Dashboard LMS Table Row)
struct LeadTableRowCard: View {
    let lead: LeadModel
    let onConvert: () -> Void
    let onReminder: () -> Void
    let onView: () -> Void
    let onDelete: () -> Void

    var channelColor: Color {
        switch lead.channel.uppercased() {
        case "WHATSAPP": return .blue
        case "META_ADS": return .indigo
        case "DIRECTORY": return .teal
        default: return .green
        }
    }

    var statusColor: Color {
        switch lead.status.uppercased() {
        case "NEW": return .blue
        case "CONTACTED": return .orange
        case "QUALIFIED": return .purple
        case "CONVERTED": return .green
        default: return .red
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            // Customer Info & Status Row
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 3) {
                    Text(lead.name)
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                    Text("\(lead.phone)\(lead.email != nil ? " • \(lead.email!)" : "")")
                        .font(.system(size: 12))
                        .foregroundColor(.manaTextSecondary)
                }
                Spacer()

                // Priority Badge
                HStack(spacing: 2) {
                    if lead.priority == "HIGH" {
                        Text("🔥 HIGH")
                            .foregroundColor(.red)
                    } else {
                        Text("MEDIUM")
                            .foregroundColor(.manaTextSecondary)
                    }
                }
                .font(.system(size: 10, weight: .black))
                .padding(.horizontal, 6)
                .padding(.vertical, 3)
                .background(Color.manaSurfaceDark)
                .cornerRadius(6)
            }

            // Channel & Status Tags
            HStack(spacing: 8) {
                Text(lead.channel)
                    .font(.system(size: 9, weight: .black))
                    .foregroundColor(channelColor)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(channelColor.opacity(0.12))
                    .cornerRadius(6)

                Text(lead.status)
                    .font(.system(size: 9, weight: .black))
                    .foregroundColor(statusColor)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(statusColor.opacity(0.12))
                    .cornerRadius(6)

                Spacer()

                if let val = lead.saleValue {
                    Text("₹\(Int(val))")
                        .font(.system(size: 14, weight: .black))
                        .foregroundColor(.manaEmerald)
                } else {
                    Text("—")
                        .font(.system(size: 12))
                        .foregroundColor(.manaTextSecondary)
                }
            }

            Divider().background(Color.manaBorder)

            // Table Actions Row
            HStack(spacing: 6) {
                if lead.status != "CONVERTED" {
                    Button(action: onConvert) {
                        HStack(spacing: 3) {
                            Image(systemName: "checkmark.circle.fill")
                            Text("Convert")
                        }
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Color.manaEmerald)
                        .cornerRadius(8)
                    }
                }

                Button(action: onReminder) {
                    HStack(spacing: 3) {
                        Image(systemName: "calendar.badge.clock")
                        Text("Reminder")
                    }
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color.blue)
                    .cornerRadius(8)
                }

                Button(action: onView) {
                    Text("View")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Color.manaSurfaceDark)
                        .cornerRadius(8)
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.manaBorder, lineWidth: 1))
                }

                Spacer()

                Button(action: onDelete) {
                    Image(systemName: "trash")
                        .font(.system(size: 12))
                        .foregroundColor(.red)
                        .padding(8)
                        .background(Color.red.opacity(0.12))
                        .clipShape(Circle())
                }
            }
        }
        .padding(14)
        .background(Color.manaSurfaceDark)
        .cornerRadius(14)
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.manaBorder, lineWidth: 1))
    }
}

// MARK: - Convert Sale Modal
struct ConvertSaleSheet: View {
    let lead: LeadModel
    @Binding var saleValue: String

    let onConfirm: (Double) -> Void
    let onClose: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Capsule().fill(Color.gray.opacity(0.4)).frame(width: 40, height: 5).padding(.top, 10)

            HStack {
                Text("Convert Deal to Won Sale")
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
                Text("Customer: \(lead.name)")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.manaTextSecondary)

                CustomFormField(label: "Final Sale Amount (₹)", placeholder: "e.g. 15000", text: $saleValue)

                Button(action: {
                    let val = Double(saleValue) ?? 0.0
                    onConfirm(val)
                }) {
                    Text("Confirm Conversion")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color.manaEmerald)
                        .cornerRadius(12)
                }
            }
            .padding(.horizontal, 16)

            Spacer()
        }
        .background(Color.manaBackground.ignoresSafeArea())
    }
}

// MARK: - Set Reminder Modal
struct ReminderSheet: View {
    let lead: LeadModel
    @Binding var reminderDate: Date
    @Binding var note: String
    @Binding var isSuccess: Bool

    let onSave: () -> Void
    let onClose: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Capsule().fill(Color.gray.opacity(0.4)).frame(width: 40, height: 5).padding(.top, 10)

            HStack {
                Text("Set Follow-up Reminder")
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

            if isSuccess {
                VStack(spacing: 12) {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 48))
                        .foregroundColor(.green)
                    Text("Calendar Reminder Scheduled!")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                }
                .padding(24)
            } else {
                VStack(alignment: .leading, spacing: 14) {
                    DatePicker("Follow-up Date & Time", selection: $reminderDate, displayedComponents: [.date, .hourAndMinute])
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                        .padding(10)
                        .background(Color.manaSurfaceDark)
                        .cornerRadius(10)

                    CustomFormField(label: "Follow-up Notes", placeholder: "e.g. Call customer for contract confirmation", text: $note)

                    Button(action: onSave) {
                        Text("Save Calendar Reminder")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color.blue)
                            .cornerRadius(12)
                    }
                }
                .padding(.horizontal, 16)
            }

            Spacer()
        }
        .background(Color.manaBackground.ignoresSafeArea())
    }
}

// MARK: - Lead Detail Sheet View
struct LeadDetailSheet: View {
    let lead: LeadModel
    let onClose: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Capsule().fill(Color.gray.opacity(0.4)).frame(width: 40, height: 5).padding(.top, 10)

            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(lead.name)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.manaTextPrimary)
                    Text("Channel: \(lead.channel)")
                        .font(.system(size: 12))
                        .foregroundColor(.manaViolet)
                }
                Spacer()
                Button(action: onClose) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.manaTextSecondary)
                }
            }
            .padding(.horizontal, 16)

            VStack(alignment: .leading, spacing: 14) {
                HStack(spacing: 10) {
                    Button(action: {
                        if let url = URL(string: "tel://\(lead.phone)") {
                            UIApplication.shared.open(url)
                        }
                    }) {
                        HStack {
                            Image(systemName: "phone.fill")
                            Text("Call \(lead.phone)")
                        }
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(Color.green)
                        .cornerRadius(10)
                    }

                    Button(action: {
                        if let url = URL(string: "https://wa.me/91\(lead.phone)") {
                            UIApplication.shared.open(url)
                        }
                    }) {
                        HStack {
                            Image(systemName: "message.fill")
                            Text("WhatsApp")
                        }
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(Color.blue)
                        .cornerRadius(10)
                    }
                }

                if let email = lead.email {
                    Text("Email: \(email)")
                        .font(.system(size: 13))
                        .foregroundColor(.manaTextSecondary)
                }

                Text("Customer Inquiry Notes")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.manaTextPrimary)

                Text(lead.notes ?? "No additional notes provided.")
                    .font(.system(size: 13))
                    .foregroundColor(.manaTextSecondary)
                    .padding(14)
                    .background(Color.manaSurfaceDark)
                    .cornerRadius(12)
            }
            .padding(.horizontal, 16)

            Spacer()
        }
        .background(Color.manaBackground.ignoresSafeArea())
    }
}

// MARK: - Sub Views
struct LeadAnalyticsSubView: View {
    let leads: [LeadModel]

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Lead Analytics & Conversion Funnel")
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(.manaTextPrimary)

            HStack(spacing: 12) {
                StatCard(title: "Total Inquiries", value: "\(leads.count)", change: "100%", color: .blue)
                StatCard(title: "Converted", value: "\(leads.filter { $0.status == "CONVERTED" }.count)", change: "Deals Won", color: .green)
            }
        }
    }
}

struct LeadSettingsSubView: View {
    @State private var autoWhatsapp: Bool = true
    @State private var autoEmail: Bool = true

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Lead Automation & Notifications")
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(.manaTextPrimary)

            Toggle("Auto WhatsApp greeting to new leads", isOn: $autoWhatsapp)
                .padding()
                .background(Color.manaSurfaceDark)
                .cornerRadius(12)

            Toggle("Instant push notification on new lead", isOn: $autoEmail)
                .padding()
                .background(Color.manaSurfaceDark)
                .cornerRadius(12)
        }
    }
}

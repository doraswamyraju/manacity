import SwiftUI

struct LoginView: View {
    let onLoginSuccess: (String) -> Void
    let onNavigateToRegister: () -> Void

    @State private var email: String = ""
    @State private var password: String = ""
    @State private var errorMessage: String? = nil
    @State private var isLoading: Bool = false
    @State private var showGoogleSheet: Bool = false


    var body: some View {
        ZStack {
            Color.manaBackground.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 24) {
                    Spacer().frame(height: 20)

                    // Logo & Header
                    VStack(spacing: 12) {
                        Image("AppIcon")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(maxWidth: 180, maxHeight: 80)
                            .cornerRadius(12)

                        Text("Welcome Back")
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(.manaTextPrimary)
                        Text("Sign in to manage your business growth & local leads")
                            .font(.system(size: 13))
                            .foregroundColor(.manaTextSecondary)
                            .multilineTextAlignment(.center)
                    }


                    VStack(alignment: .leading, spacing: 16) {
                        // Error Alert Banner
                        if let error = errorMessage {
                            HStack {
                                Image(systemName: "exclamationmark.triangle.fill")
                                    .foregroundColor(.red)
                                Text(error)
                                    .font(.system(size: 13))
                                    .foregroundColor(.red)
                            }
                            .padding()
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color.red.opacity(0.1))
                            .cornerRadius(10)
                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.red.opacity(0.3), lineWidth: 1))
                        }

                        // Google / Gmail Sign In Button
                        Button(action: {
                            showGoogleSheet = true
                        }) {
                            HStack(spacing: 8) {
                                Image(systemName: "g.circle.fill")
                                    .font(.system(size: 20))
                                    .foregroundColor(.red)
                                Text("Sign In with Google / Gmail")
                                    .font(.system(size: 15, weight: .semibold))
                                    .foregroundColor(.manaTextPrimary)
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 48)
                            .background(Color.manaSurfaceDark)
                            .cornerRadius(10)
                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.manaBorder, lineWidth: 1))
                        }
                        .sheet(isPresented: $showGoogleSheet) {
                            GoogleSignInWebSheet(url: URL(string: "https://accounts.google.com/o/oauth2/v2/auth?client_id=1028741369324-manacity.apps.googleusercontent.com&redirect_uri=https://manacity.in/api/auth/google/callback&response_type=token%20id_token&scope=openid%20email%20profile")!) { token, email in
                                if let token = token {
                                    performSocialLogin(token: token, provider: "google", email: email, name: nil)
                                } else {
                                    errorMessage = "Google sign-in was cancelled or failed."
                                }
                            }
                        }








                        Text("⚡ Fast 1-Click Authentication")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.manaViolet)
                            .frame(maxWidth: .infinity, alignment: .center)

                        // Divider
                        HStack {
                            Rectangle().frame(height: 1).foregroundColor(.manaBorder.opacity(0.5))
                            Text("or sign in with email")
                                .font(.system(size: 12))
                                .foregroundColor(.manaTextSecondary)
                            Rectangle().frame(height: 1).foregroundColor(.manaBorder.opacity(0.5))
                        }
                        .padding(.vertical, 4)

                        // Form Inputs
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Email Address")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(.manaTextPrimary)
                            TextField("name@company.com", text: $email)
                                .keyboardType(.emailAddress)
                                .autocapitalization(.none)
                                .padding()
                                .background(Color.manaSurfaceDark)
                                .cornerRadius(10)
                                .foregroundColor(.manaTextPrimary)
                        }

                        VStack(alignment: .leading, spacing: 6) {
                            Text("Password")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(.manaTextPrimary)
                            SecureField("••••••••", text: $password)
                                .padding()
                                .background(Color.manaSurfaceDark)
                                .cornerRadius(10)
                                .foregroundColor(.manaTextPrimary)
                        }

                        ManaGradientButton(title: isLoading ? "Signing In..." : "Sign In") {
                            if email.isEmpty || password.isEmpty {
                                errorMessage = "Please fill in all fields."
                            } else {
                                errorMessage = nil
                                performEmailLogin()
                            }
                        }
                        .padding(.top, 8)

                        // Navigate to Sign Up
                        HStack {
                            Text("Don't have an account?")
                                .font(.system(size: 14))
                                .foregroundColor(.manaTextSecondary)
                            Button(action: onNavigateToRegister) {
                                Text("Sign Up")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.manaTeal)
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(.top, 4)
                    }
                    .manaGlassCard()
                    .padding(.horizontal)
                }
            }
        }
    }

    private func performEmailLogin() {
        isLoading = true
        errorMessage = nil
        guard let url = URL(string: "https://manacity.in/api/auth/login") else { return }
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        let body: [String: String] = ["email": email, "password": password]
        req.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: req) { data, response, error in
            DispatchQueue.main.async {
                isLoading = false
                if let error = error {
                    errorMessage = "Network error: \(error.localizedDescription)"
                    return
                }
                guard let data = data, let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                    errorMessage = "Invalid response from server."
                    return
                }

                if let errText = json["error"] as? String {
                    errorMessage = errText
                } else if let userObj = json["user"] as? [String: Any], let role = userObj["role"] as? String {
                    if let token = json["token"] as? String {
                        UserDefaults.standard.set(token, forKey: "userToken")
                    }
                    onLoginSuccess(role)
                } else {
                    errorMessage = "Authentication failed. Please check your credentials."
                }
            }
        }.resume()
    }

    private func performSocialLogin(token: String, provider: String, email: String?, name: String?) {
        isLoading = true
        errorMessage = nil
        let endpoint = provider == "apple" ? "/api/auth/apple" : "/api/auth/google"
        guard let url = URL(string: "https://manacity.in\(endpoint)") else { return }
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        var body: [String: Any] = ["identityToken": token, "idToken": token]
        if let email = email { body["email"] = email }
        if let name = name { body["name"] = name }
        req.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: req) { data, response, error in
            DispatchQueue.main.async {
                isLoading = false
                if let error = error {
                    errorMessage = "Network error: \(error.localizedDescription)"
                    return
                }
                guard let data = data, let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                    errorMessage = "Invalid response from server."
                    return
                }

                if let errText = json["error"] as? String {
                    errorMessage = errText
                } else if let userObj = json["user"] as? [String: Any], let role = userObj["role"] as? String {
                    if let token = json["token"] as? String {
                        UserDefaults.standard.set(token, forKey: "userToken")
                    }
                    onLoginSuccess(role)
                } else {
                    errorMessage = "\(provider.capitalized) authentication failed."
                }
            }
        }.resume()
    }



}

struct RegisterView: View {
    let onRegisterSuccess: (String) -> Void
    let onNavigateToLogin: () -> Void

    @State private var role: String = "BUSINESS_OWNER"
    @State private var name: String = ""
    @State private var email: String = ""
    @State private var phone: String = ""
    @State private var password: String = ""
    @State private var errorMessage: String? = nil
    @State private var isLoading: Bool = false
    @State private var showGoogleSheet: Bool = false

    var body: some View {
        ZStack {
            Color.manaBackground.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 20) {
                    Spacer().frame(height: 10)

                    VStack(spacing: 8) {
                        Image("AppIcon")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(maxWidth: 180, maxHeight: 75)
                            .cornerRadius(12)

                        Text("Create Your Account")
                            .font(.system(size: 22, weight: .bold))
                            .foregroundColor(.manaTextPrimary)
                        Text("Join the local business directory & aggregator platform")
                            .font(.system(size: 12))
                            .foregroundColor(.manaTextSecondary)
                    }


                    VStack(alignment: .leading, spacing: 14) {
                        HStack(spacing: 6) {
                            Button(action: { role = "BUSINESS_OWNER" }) {
                                HStack(spacing: 6) {
                                    Image(systemName: "building.2.fill")
                                        .font(.system(size: 12))
                                    Text("Admin (Business Owner)")
                                        .font(.system(size: 12, weight: .bold))
                                }
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                                .background(role == "BUSINESS_OWNER" ? Color.manaViolet : Color.clear)
                                .foregroundColor(.white)
                                .cornerRadius(8)
                            }

                            Button(action: { role = "CUSTOMER" }) {
                                HStack(spacing: 6) {
                                    Image(systemName: "person.fill")
                                        .font(.system(size: 12))
                                    Text("Customer / End User")
                                        .font(.system(size: 12, weight: .bold))
                                }
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                                .background(role == "CUSTOMER" ? Color.manaViolet : Color.clear)
                                .foregroundColor(.white)
                                .cornerRadius(8)
                            }
                        }
                        .padding(4)
                        .background(Color.manaBackground)
                        .cornerRadius(10)

                        if let error = errorMessage {
                            HStack {
                                Image(systemName: "exclamationmark.triangle.fill")
                                    .foregroundColor(.red)
                                Text(error)
                                    .font(.system(size: 13))
                                    .foregroundColor(.red)
                            }
                            .padding()
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color.red.opacity(0.1))
                            .cornerRadius(10)
                        }

                        VStack(alignment: .leading, spacing: 6) {
                            Text("Full Name *")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(.manaTextPrimary)
                            TextField("e.g. Doraswamy Raju", text: $name)
                                .padding()
                                .background(Color.manaSurfaceDark)
                                .cornerRadius(10)
                                .foregroundColor(.manaTextPrimary)
                        }

                        VStack(alignment: .leading, spacing: 6) {
                            Text("Email Address *")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(.manaTextPrimary)
                            TextField("name@company.com", text: $email)
                                .keyboardType(.emailAddress)
                                .autocapitalization(.none)
                                .padding()
                                .background(Color.manaSurfaceDark)
                                .cornerRadius(10)
                                .foregroundColor(.manaTextPrimary)
                        }

                        VStack(alignment: .leading, spacing: 6) {
                            Text("10-Digit Mobile Number *")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(.manaTextPrimary)
                            TextField("+91 98765 43210", text: $phone)
                                .keyboardType(.phonePad)
                                .padding()
                                .background(Color.manaSurfaceDark)
                                .cornerRadius(10)
                                .foregroundColor(.manaTextPrimary)
                        }

                        VStack(alignment: .leading, spacing: 6) {
                            Text("Password *")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(.manaTextPrimary)
                            SecureField("At least 6 characters", text: $password)
                                .padding()
                                .background(Color.manaSurfaceDark)
                                .cornerRadius(10)
                                .foregroundColor(.manaTextPrimary)
                        }

                        ManaGradientButton(title: role == "BUSINESS_OWNER" ? "Sign Up as Business Admin" : "Sign Up as Customer") {
                            if name.isEmpty || email.isEmpty || phone.isEmpty || password.isEmpty {
                                errorMessage = "Please fill in all required fields including your mobile number."
                            } else {
                                errorMessage = nil
                                performRegistration()
                            }
                        }
                        .padding(.top, 6)

                        HStack {
                            Rectangle().frame(height: 1).foregroundColor(.manaBorder.opacity(0.5))
                            Text("or continue with")
                                .font(.system(size: 12))
                                .foregroundColor(.manaTextSecondary)
                            Rectangle().frame(height: 1).foregroundColor(.manaBorder.opacity(0.5))
                        }

                        // Google Sign Up Button
                        Button(action: {
                            showGoogleSheet = true
                        }) {
                            HStack(spacing: 8) {
                                Image(systemName: "g.circle.fill")
                                    .font(.system(size: 20))
                                    .foregroundColor(.red)
                                Text("Continue with Google / Gmail")
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundColor(.manaTextPrimary)
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 44)
                            .background(Color.manaSurfaceDark)
                            .cornerRadius(10)
                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.manaBorder, lineWidth: 1))
                        }
                        .sheet(isPresented: $showGoogleSheet) {
                            GoogleSignInWebSheet(url: URL(string: "https://accounts.google.com/o/oauth2/v2/auth?client_id=1028741369324-manacity.apps.googleusercontent.com&redirect_uri=https://manacity.in/api/auth/google/callback&response_type=token%20id_token&scope=openid%20email%20profile")!) { token, email in
                                if let token = token {
                                    performSocialRegistration(token: token, provider: "google", email: email, name: nil)
                                } else {
                                    errorMessage = "Google registration was cancelled or failed."
                                }
                            }
                        }

                        HStack {
                            Text("Already registered?")
                                .font(.system(size: 14))
                                .foregroundColor(.manaTextSecondary)
                            Button(action: onNavigateToLogin) {
                                Text("Sign In Here")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.manaTeal)
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(.top, 4)
                    }
                    .manaGlassCard()
                    .padding(.horizontal)
                }
            }
        }
    }

    private func performRegistration() {
        isLoading = true
        errorMessage = nil
        guard let url = URL(string: "https://manacity.in/api/auth/register") else { return }
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        let body: [String: Any] = ["name": name, "email": email, "phone": phone, "password": password, "role": role]
        req.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: req) { data, response, error in
            DispatchQueue.main.async {
                isLoading = false
                if let error = error {
                    errorMessage = "Network error: \(error.localizedDescription)"
                    return
                }
                guard let data = data, let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                    errorMessage = "Invalid response from server."
                    return
                }

                if let errText = json["error"] as? String {
                    errorMessage = errText
                } else if let userObj = json["user"] as? [String: Any], let assignedRole = userObj["role"] as? String {
                    if let token = json["token"] as? String {
                        UserDefaults.standard.set(token, forKey: "userToken")
                    }
                    onRegisterSuccess(assignedRole)
                } else {
                    errorMessage = "Registration failed. Please try again."
                }
            }
        }.resume()
    }

    private func performSocialRegistration(token: String, provider: String, email: String?, name: String?) {
        isLoading = true
        errorMessage = nil
        let endpoint = provider == "apple" ? "/api/auth/apple" : "/api/auth/google"
        guard let url = URL(string: "https://manacity.in\(endpoint)") else { return }
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        var body: [String: Any] = ["identityToken": token, "idToken": token, "role": role]
        if let email = email { body["email"] = email }
        if let name = name { body["name"] = name }
        req.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: req) { data, response, error in
            DispatchQueue.main.async {
                isLoading = false
                if let error = error {
                    errorMessage = "Network error: \(error.localizedDescription)"
                    return
                }
                guard let data = data, let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                    errorMessage = "Invalid response from server."
                    return
                }

                if let errText = json["error"] as? String {
                    errorMessage = errText
                } else if let userObj = json["user"] as? [String: Any], let assignedRole = userObj["role"] as? String {
                    if let token = json["token"] as? String {
                        UserDefaults.standard.set(token, forKey: "userToken")
                    }
                    onRegisterSuccess(assignedRole)
                } else {
                    errorMessage = "\(provider.capitalized) sign-up failed."
                }
            }
        }.resume()
    }



}

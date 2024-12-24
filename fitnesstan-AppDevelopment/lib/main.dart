import 'package:flutter/material.dart';
import 'welcome.dart';
import 'signup.dart';
import 'login.dart';
import 'verification.dart';
import 'dashboard.dart';
import 'diet_dashboard.dart';
import 'meal_section_screen.dart'; // Import the meal section screen

void main() {
  runApp(const FitnesstanApp());
} 

class FitnesstanApp extends StatelessWidget {
  const FitnesstanApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Fitnesstan',
      theme: ThemeData(primarySwatch: Colors.red),
      initialRoute: '/',
      routes: { 
        '/': (context) => const WelcomeScreen(),
        '/signup': (context) => const SignUpScreen(),
        '/login': (context) => const LoginScreen(),
        '/verification': (context) => const VerificationScreen(),
        '/dashboard': (context) => const DashboardScreen(),
        '/diet_dashboard': (context) => const DietDashboard(),
        '/meal_section': (context) => const MealSectionScreen(section: 'Lunch'),
      },
    );
  }
}

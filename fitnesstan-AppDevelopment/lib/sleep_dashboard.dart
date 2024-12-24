import 'package:flutter/material.dart';

class SleepDashboard extends StatelessWidget {
  const SleepDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Colors.red, Colors.black],
        ),
      ),
      child: Center(
        child: Text(
          'Sleep Tracker Coming Soon!',
          style: TextStyle(
            color: Colors.white,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}

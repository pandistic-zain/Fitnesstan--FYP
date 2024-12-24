import 'package:flutter/material.dart';
import 'workout_button.dart'; // Import your WorkoutButton widget

class WorkoutDashboard extends StatelessWidget {
  const WorkoutDashboard({super.key});

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
      child: Column(
        children: [
          const SizedBox(height: 20),
          // Circular Progress Indicator for Overall Progress
          Center(
            child: Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  height: 180,
                  width: 180,
                  child: CircularProgressIndicator(
                    value: 0.1, // Example: 10% progress
                    strokeWidth: 12,
                    color: Colors.white,
                    backgroundColor: Colors.red.shade200,
                  ),
                ),
                const Text(
                  '10%',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          const Text(
            'Overall Progress',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 20),
          // Workout Categories
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              children: [
                WorkoutButton(
                  title: 'Easy',
                  description: 'Beginner-level workouts to ease into fitness.',
                  imagePath: 'assets/easy.jpg',
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Easy Workouts clicked')),
                    );
                  },
                ),
                const SizedBox(height: 16),
                WorkoutButton(
                  title: 'Medium',
                  description: 'Intermediate workouts for steady progress.',
                  imagePath: 'assets/medium.jpg',
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Medium Workouts clicked')),
                    );
                  },
                ),
                const SizedBox(height: 16),
                WorkoutButton(
                  title: 'Hard',
                  description: 'Advanced workouts to challenge your strength.',
                  imagePath: 'assets/hard.jpg',
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Hard Workouts clicked')),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

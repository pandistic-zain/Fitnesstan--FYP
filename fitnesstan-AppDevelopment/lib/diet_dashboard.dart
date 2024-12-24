import 'package:flutter/material.dart';
import 'meal_section_screen.dart';

class DietDashboard extends StatelessWidget {
  const DietDashboard({super.key});

  void navigateToSection(BuildContext context, String section) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MealSectionScreen(section: section),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.red, Colors.black],
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),
              // Title
              const Text(
                'Plan Your Diet',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 10),
              // Buttons
              Row(
                children: [
                  _buildActionButton(context, 'Meal Ideas'),
                  const SizedBox(width: 8),
                  _buildActionButton(context, 'Calorie Tracker'),
                ],
              ),
              const SizedBox(height: 10),
              // Subtitle
              const Text(
                'Here, you can plan your meals, track your calorie intake, and maintain a healthy lifestyle effortlessly.',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 14,
                  fontStyle: FontStyle.italic,
                ),
              ),
              const SizedBox(height: 20),
              // Sections
              const Text(
                'Meal Categories',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 10),
              Expanded(
                child: ListView(
                  children: [
                    _buildMealCard(
                      context,
                      title: 'Lunch',
                      subtitle: 'Plan Your Lunch',
                      imagePath: 'assets/lunch.jpg',
                      onTap: () => navigateToSection(context, 'Lunch'),
                    ),
                    const SizedBox(height: 10),
                    _buildMealCard(
                      context,
                      title: 'Breakfast',
                      subtitle: 'Plan Your Breakfast',
                      imagePath: 'assets/breakfast.jpg',
                      onTap: () => navigateToSection(context, 'Breakfast'),
                    ),
                    const SizedBox(height: 10),
                    _buildMealCard(
                      context,
                      title: 'Dinner',
                      subtitle: 'Plan Your Dinner',
                      imagePath: 'assets/dinner.jpg',
                      onTap: () => navigateToSection(context, 'Dinner'),
                    ),
                    const SizedBox(height: 10),
                    _buildMealCard(
                      context,
                      title: 'Snack',
                      subtitle: 'Plan Your Snacks',
                      imagePath: 'assets/snack.jpg',
                      onTap: () => navigateToSection(context, 'Snack'),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Button Builder
  Widget _buildActionButton(BuildContext context, String text) {
    return Expanded(
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
        ),
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('$text clicked')),
          );
        },
        child: Text(
          text,
          style: const TextStyle(
            color: Colors.red,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  // Meal Card Builder
  Widget _buildMealCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required String imagePath,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 100,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.2),
              blurRadius: 6,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            // Image
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(16),
                  bottomLeft: Radius.circular(16),
                ),
                image: DecorationImage(
                  image: AssetImage(imagePath),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(width: 10),
            // Texts
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.red,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      color: Colors.black54,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.chevron_right,
              color: Colors.red,
            ),
            const SizedBox(width: 10),
          ],
        ),
      ),
    );
  }
}

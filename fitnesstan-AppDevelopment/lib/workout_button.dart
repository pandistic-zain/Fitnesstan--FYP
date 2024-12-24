import 'package:flutter/material.dart';

class WorkoutButton extends StatelessWidget {
  final String title;
  final String imagePath;
  final String description;
  final VoidCallback onTap;

  const WorkoutButton({
    super.key,
    required this.title,
    required this.imagePath,
    required this.description,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap, // Callback for when the button is tapped
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200), // Smooth animation
        curve: Curves.easeInOut, // Transition curve
        height: 120, // Fixed height for uniformity
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16), // Rounded corners
          image: DecorationImage(
            image: AssetImage(imagePath), // Workout image
            fit: BoxFit.cover,
            colorFilter: ColorFilter.mode(
              Colors.black.withOpacity(0.4), // Dark overlay for readability
              BlendMode.darken,
            ),
          ),
          border: Border.all(
            color: Colors.red, // Red border for consistency with the theme
            width: 2,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            mainAxisAlignment:
                MainAxisAlignment.spaceBetween, // Layout adjustment
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    title, // Title of the workout
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    description, // Description of the workout
                    style: const TextStyle(
                      fontSize: 14,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
              const Icon(
                Icons.chevron_right,
                color: Colors.white,
                size: 32, // Chevron icon for navigation hint
              ),
            ],
          ),
        ),
      ),
    );
  }
}

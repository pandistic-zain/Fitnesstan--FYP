import 'package:flutter/material.dart';
import 'workout_dashboard.dart'; // Import for the workout page
import 'diet_dashboard.dart'; // Import for the diet page
import 'sleep_dashboard.dart'; // Import for the sleep page

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedIndex = 0; // Default tab index is 0 (Workouts)

  // List of widgets for each tab
  final List<Widget> _pages = [
    const WorkoutDashboard(), // Render WorkoutDashboard
    const DietDashboard(), // Render DietDashboard
    const SleepDashboard(), // Render SleepDashboard
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.red,
        title: Text(
          _selectedIndex == 0
              ? 'WORKOUT'
              : _selectedIndex == 1
                  ? 'DIET PLANS'
                  : 'SLEEP',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Notifications clicked')),
              );
            },
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(4.0),
          child: Container(
            color: Colors.black,
            height: 4.0,
          ),
        ),
      ),
      body: _pages[_selectedIndex], // Dynamically load selected page
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.red,
        unselectedItemColor: Colors.grey,
        onTap: (index) {
          setState(() {
            _selectedIndex = index; // Update the selected index
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.fitness_center),
            label: 'Workouts',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.restaurant),
            label: 'Diet Plans',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.bed),
            label: 'Sleep',
          ),
        ],
      ),
    );
  }
}

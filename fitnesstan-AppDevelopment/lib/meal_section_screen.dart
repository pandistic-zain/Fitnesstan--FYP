import 'package:flutter/material.dart';

class MealSectionScreen extends StatefulWidget {
  final String section;

  const MealSectionScreen({required this.section, super.key});

  @override
  _MealSectionScreenState createState() => _MealSectionScreenState();
}

class _MealSectionScreenState extends State<MealSectionScreen> {
  final TextEditingController mealController = TextEditingController();
  List<Map<String, dynamic>> meals = [];
  int totalSectionCalories = 0;
  int overallCalories = 0;
  final int tdee = 2000; // Example TDEE value
  bool sectionCompleted = false;

  void _addMeal(String meal) {
    setState(() {
      if (meal.isNotEmpty) {
        meals.add({'name': meal, 'calories': 0});
        mealController.clear();
      }
    });
  }

  void _removeMeal(int index) {
    setState(() {
      overallCalories -= meals[index]['calories'] as int;
      meals.removeAt(index);
      _updateProgress();
    });
  }

  void _calculateCalories() {
    setState(() {
      totalSectionCalories = 0;
      for (var meal in meals) {
        meal['calories'] =
            (100 + meal['name'].length * 10).toInt(); // Mock calculation
        totalSectionCalories += meal['calories'] as int;
      }
    });
  }

  void _markComplete() {
    setState(() {
      overallCalories += totalSectionCalories;
      sectionCompleted = true;
      _updateProgress();
    });
  }

  void _updateProgress() {
    if (overallCalories >= tdee) {
      _resetForNewDay();
    }
  }

  void _resetForNewDay() {
    Future.delayed(const Duration(seconds: 1), () {
      setState(() {
        overallCalories = 0;
        meals.clear();
        sectionCompleted = false;
        totalSectionCalories = 0;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.section} Section'),
        backgroundColor: Colors.red,
      ),
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
              // Overall Progress Counter
              _buildProgressCounter(),
              const SizedBox(height: 20),
              // Meal Input Section
              _buildMealInputSection(),
              const SizedBox(height: 20),
              // Meals List
              Expanded(
                child: ListView.builder(
                  itemCount: meals.length,
                  itemBuilder: (context, index) {
                    final meal = meals[index];
                    return Card(
                      color: Colors.white.withOpacity(0.1),
                      child: ListTile(
                        title: Text(
                          meal['name'],
                          style: const TextStyle(color: Colors.white),
                        ),
                        subtitle: Text(
                          '${meal['calories']} calories',
                          style: const TextStyle(color: Colors.white70),
                        ),
                        trailing: IconButton(
                          icon: const Icon(Icons.remove_circle,
                              color: Colors.red),
                          onPressed: () => _removeMeal(index),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 10),
              // Calculate Button
              ElevatedButton(
                onPressed: _calculateCalories,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                ),
                child: const Text('Calculate'),
              ),
              const SizedBox(height: 10),
              // Complete Button (if calculation is done)
              if (meals.isNotEmpty && !sectionCompleted)
                ElevatedButton(
                  onPressed: _markComplete,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  child: const Text(
                    'Complete',
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProgressCounter() {
    return Center(
      child: Stack(
        alignment: Alignment.center,
        children: [
          SizedBox(
            height: 150,
            width: 150,
            child: CircularProgressIndicator(
              value: overallCalories / tdee,
              strokeWidth: 12,
              color: Colors.white,
              backgroundColor: Colors.red.shade200,
            ),
          ),
          Text(
            '${((overallCalories / tdee) * 100).toStringAsFixed(1)}%',
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMealInputSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Add a Meal:',
          style: TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: mealController,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: 'Enter meal (e.g., eggs, milk)',
                  hintStyle: const TextStyle(color: Colors.white70),
                  filled: true,
                  fillColor: Colors.white.withOpacity(0.2),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ),
            IconButton(
              icon: const Icon(Icons.add, color: Colors.red),
              onPressed: () => _addMeal(mealController.text),
            ),
          ],
        ),
      ],
    );
  }
}

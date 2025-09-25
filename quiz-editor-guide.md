#  Quiz Editor Guide - Adding Questions & Editing Timers

##  **Overview**
This guide shows you how to add more questions to existing DSA quizzes and modify quiz timers.

## 🔧 **Method 1: Using the Quiz Editor Script (Recommended)**

### **Step 1: Run the Editor Script**
```bash
node edit-quiz.js
```

### **Step 2: Modify the Script for Your Needs**

#### **Adding Questions to a Specific Quiz**
```javascript
const addQuestionsToQuiz = async () => {
  try {
    // Find the quiz by title
    const quiz = await Quiz.findOne({ title: "Your Quiz Title" });
    
    // Define new questions
    const additionalQuestions = [
      {
        question: "Your question text here?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0, // Index of correct answer (0-3)
        points: 10,
        explanation: "Explanation for the correct answer."
      },
      // Add more questions...
    ];

    // Add questions to the quiz
    quiz.questions.push(...additionalQuestions);
    
    // Update time limit (recommended: 2 minutes per question + 5 minutes buffer)
    quiz.timeLimit = Math.max(15, quiz.questions.length * 2 + 5);
    
    await quiz.save();
    console.log(` Added ${additionalQuestions.length} questions`);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### **Updating Quiz Timer**
```javascript
// Method 1: Set specific time
quiz.timeLimit = 30; // 30 minutes

// Method 2: Calculate based on question count
quiz.timeLimit = Math.max(15, quiz.questions.length * 2 + 5);

// Method 3: Update all DSA quizzes at once
const updateAllDSATimers = async () => {
  const dsaQuizzes = await Quiz.find({ category: 'DSA' });
  
  for (const quiz of dsaQuizzes) {
    quiz.timeLimit = Math.max(15, quiz.questions.length * 2 + 5);
    await quiz.save();
  }
};
```

##  **Method 2: Direct Database Operations**

### **Using MongoDB Compass or MongoDB Shell**

#### **Find a Quiz**
```javascript
// Find by title
db.quizzes.findOne({ title: "Arrays and Basic Operations" })

// Find by category
db.quizzes.find({ category: "DSA" })
```

#### **Add Questions to Existing Quiz**
```javascript
db.quizzes.updateOne(
  { title: "Arrays and Basic Operations" },
  {
    $push: {
      questions: {
        question: "What is the time complexity of binary search?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 1,
        points: 10,
        explanation: "Binary search halves the search space in each iteration."
      }
    }
  }
)
```

#### **Update Quiz Timer**
```javascript
db.quizzes.updateOne(
  { title: "Arrays and Basic Operations" },
  { $set: { timeLimit: 25 } }
)
```

##  **Method 3: Create New Quizzes with More Questions**

### **Template for New DSA Quiz**
```javascript
const newQuiz = {
  title: "Advanced Array Operations",
  description: "Advanced concepts in array manipulation and algorithms.",
  category: "DSA",
  difficulty: "hard",
  timeLimit: 35,
  passingScore: 80,
  questions: [
    {
      question: "What is the time complexity of the two-pointer technique for finding pairs?",
      options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
      correctAnswer: 1,
      points: 10,
      explanation: "Two-pointer technique requires O(n) time as each pointer moves at most n times."
    },
    // Add more questions...
  ],
  creator: defaultUser._id,
  isPublic: true,
  isActive: true
};
```

##  **Question Structure**

### **Required Fields**
```javascript
{
  question: "Your question text?",
  options: ["A", "B", "C", "D"], // Exactly 4 options
  correctAnswer: 0, // Index (0-3) of correct option
  points: 10, // Points for this question
  explanation: "Why this answer is correct"
}
```

### **Question Types You Can Add**

#### **1. Time Complexity Questions**
```javascript
{
  question: "What is the time complexity of [algorithm]?",
  options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
  correctAnswer: 2,
  points: 10,
  explanation: "This algorithm processes each element once, making it O(n)."
}
```

#### **2. Algorithm Comparison Questions**
```javascript
{
  question: "Which sorting algorithm is most efficient for small datasets?",
  options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Heap Sort"],
  correctAnswer: 2,
  points: 10,
  explanation: "Insertion Sort has better cache locality and simpler implementation for small datasets."
}
```

#### **3. Implementation Questions**
```javascript
{
  question: "What data structure is best for implementing a priority queue?",
  options: ["Array", "Linked List", "Heap", "Stack"],
  correctAnswer: 2,
  points: 10,
  explanation: "Heap provides O(log n) insertion and O(1) access to highest priority element."
}
```

## ⏱️ **Timer Guidelines**

### **Recommended Time Limits**
- **Easy Questions:** 1.5-2 minutes per question
- **Medium Questions:** 2-2.5 minutes per question  
- **Hard Questions:** 2.5-3 minutes per question
- **Buffer Time:** Add 5-10 minutes for review

### **Formula for Automatic Timer Calculation**
```javascript
const calculateTimeLimit = (questions, difficulty) => {
  const baseTime = questions.length * 2; // 2 minutes per question
  const buffer = 5; // 5 minutes buffer
  
  switch(difficulty) {
    case 'easy': return Math.max(15, baseTime + buffer);
    case 'medium': return Math.max(20, baseTime + buffer + 2);
    case 'hard': return Math.max(25, baseTime + buffer + 5);
    default: return Math.max(15, baseTime + buffer);
  }
};
```

##  **Quick Commands**

### **View All DSA Quizzes**
```bash
node -e "
const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
mongoose.connect('your-mongodb-uri').then(async () => {
  const quizzes = await Quiz.find({category: 'DSA'}).select('title questions.length timeLimit');
  console.log(quizzes);
  process.exit(0);
});
"
```

### **Add Questions to Specific Quiz**
```bash
# Edit edit-quiz.js and run:
node edit-quiz.js
```

### **Update All Timers**
```bash
# The script automatically updates all timers
node edit-quiz.js
```

##  **Best Practices**

### **Question Writing Tips**
1. **Clear and Concise:** Make questions easy to understand
2. **Four Options:** Always provide exactly 4 answer choices
3. **Plausible Distractors:** Wrong answers should be believable
4. **Detailed Explanations:** Help users learn from mistakes
5. **Progressive Difficulty:** Mix easy, medium, and hard questions

### **Timer Management**
1. **Consistent Formula:** Use the same calculation method across quizzes
2. **Adequate Buffer:** Always add extra time for review
3. **Difficulty Adjustment:** Harder questions need more time
4. **Question Count:** More questions = more time needed

### **Quiz Organization**
1. **Logical Flow:** Order questions from basic to advanced
2. **Topic Coverage:** Ensure all important concepts are tested
3. **Balanced Difficulty:** Mix different difficulty levels
4. **Clear Categories:** Use descriptive titles and categories

##  **Troubleshooting**

### **Common Issues**
1. **Quiz Not Found:** Check the exact title spelling
2. **Invalid Question Format:** Ensure all required fields are present
3. **Timer Too Short:** Use the recommended calculation formula
4. **Database Connection:** Verify MongoDB connection string

### **Debug Commands**
```javascript
// Check if quiz exists
const quiz = await Quiz.findOne({ title: "Exact Title" });
console.log(quiz ? "Found" : "Not found");

// Check question count
console.log(`Questions: ${quiz.questions.length}`);

// Validate question format
quiz.questions.forEach((q, i) => {
  if (!q.question || !q.options || q.options.length !== 4) {
    console.log(`Invalid question at index ${i}`);
  }
});
```

##  **Next Steps**

1. **Run the editor script** to see how it works
2. **Modify the script** to add questions to your preferred quizzes
3. **Create new quizzes** with comprehensive question sets
4. **Test the updated quizzes** in your application
5. **Iterate and improve** based on user feedback

Remember: The key is to maintain consistency in question quality and timing across all your DSA quizzes!

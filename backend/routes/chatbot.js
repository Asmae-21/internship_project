const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Log = require('../models/Log');

// Middleware to check if user is teacher
const requireTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Access denied. Teacher role required.' });
  }
  next();
};

// Predefined content templates
const contentTemplates = {
  lesson: {
    title: "Sample Lesson: Introduction to Algebra",
    description: "A comprehensive lesson on basic algebraic concepts including variables, equations, and simple operations.",
    type: "Lesson",
    tags: ["algebra", "mathematics", "equations", "variables"],
    files: [],
    content: {
      objectives: [
        "Understand basic algebraic concepts",
        "Learn to solve simple equations",
        "Apply algebraic principles to real-world problems"
      ],
      materials: [
        "Whiteboard and markers",
        "Student notebooks",
        "Practice worksheets"
      ],
      activities: [
        "Introduction to variables (15 minutes)",
        "Solving basic equations (20 minutes)",
        "Group practice problems (15 minutes)",
        "Real-world application examples (10 minutes)"
      ],
      assessment: "Exit ticket: Solve 3 simple equations"
    }
  },

  quiz: {
    title: "Mathematics Quiz: Basic Operations",
    description: "A quiz testing fundamental mathematical operations and problem-solving skills.",
    type: "Quiz",
    tags: ["mathematics", "quiz", "operations", "assessment"],
    files: [],
    content: {
      questions: [
        {
          question: "What is 15 + 27?",
          options: ["42", "41", "43", "40"],
          correctAnswer: "42",
          explanation: "15 + 27 = 42"
        },
        {
          question: "Solve for x: 2x + 5 = 15",
          options: ["x = 5", "x = 10", "x = 7.5", "x = 3"],
          correctAnswer: "x = 5",
          explanation: "2x + 5 = 15 → 2x = 10 → x = 5"
        },
        {
          question: "What is 8 × 6?",
          options: ["48", "46", "50", "44"],
          correctAnswer: "48",
          explanation: "8 × 6 = 48"
        }
      ],
      timeLimit: 20,
      totalPoints: 30
    }
  },

  assignment: {
    title: "Research Assignment: Environmental Science",
    description: "Students will research and present on a current environmental issue affecting their local community.",
    type: "Assignment",
    tags: ["environmental science", "research", "presentation", "community"],
    files: [],
    content: {
      requirements: [
        "Research a local environmental issue",
        "Create a 5-minute presentation",
        "Include at least 3 credible sources",
        "Provide 2-3 potential solutions"
      ],
      rubric: {
        research: "25 points - Quality and depth of research",
        presentation: "25 points - Clarity and organization",
        sources: "20 points - Credibility and citation",
        solutions: "20 points - Feasibility and creativity",
        participation: "10 points - Class discussion contribution"
      },
      dueDate: "Two weeks from assignment",
      format: "Digital presentation (PowerPoint, Google Slides, or Prezi)"
    }
  },

  project: {
    title: "STEM Project: Build a Simple Robot",
    description: "Students will design and build a simple robot using basic electronics and programming concepts.",
    type: "Project",
    tags: ["STEM", "robotics", "electronics", "programming"],
    files: [],
    content: {
      objectives: [
        "Apply basic electronics principles",
        "Learn introductory programming concepts",
        "Develop problem-solving skills",
        "Work collaboratively in teams"
      ],
      materials: [
        "Arduino Uno board",
        "Motors and wheels",
        "Sensors (ultrasonic, light)",
        "Breadboard and jumper wires",
        "Battery pack"
      ],
      phases: [
        "Planning and design (Week 1)",
        "Building the prototype (Week 2)",
        "Programming and testing (Week 3)",
        "Final presentation (Week 4)"
      ],
      deliverables: [
        "Working robot prototype",
        "Project documentation",
        "Code repository",
        "Final presentation"
      ]
    }
  },

  worksheet: {
    title: "Grammar Worksheet: Parts of Speech",
    description: "Practice identifying and using different parts of speech in sentences.",
    type: "Worksheet",
    tags: ["grammar", "parts of speech", "language arts"],
    files: [],
    content: {
      instructions: "Identify the part of speech for each underlined word in the sentences below.",
      exercises: [
        {
          sentence: "The quick brown fox jumps over the lazy dog.",
          words: ["quick", "jumps", "lazy"],
          answers: ["adjective", "verb", "adjective"]
        },
        {
          sentence: "Sarah went to the store and bought milk, bread, and eggs.",
          words: ["went", "store", "bought"],
          answers: ["verb", "noun", "verb"]
        }
      ],
      practice: [
        "Write 3 sentences using at least 5 different parts of speech.",
        "Create a word bank with examples of each part of speech."
      ]
    }
  },

  summary: {
    title: "Chapter Summary: The American Revolution",
    description: "A comprehensive summary of key events and figures from the American Revolution.",
    type: "Summary",
    tags: ["history", "american revolution", "summary"],
    files: [],
    content: {
      keyEvents: [
        "Boston Tea Party (1773)",
        "First Continental Congress (1774)",
        "Lexington and Concord (1775)",
        "Declaration of Independence (1776)",
        "Saratoga Campaign (1777)",
        "Yorktown Surrender (1781)"
      ],
      keyFigures: [
        "George Washington - Commander of Continental Army",
        "Thomas Jefferson - Author of Declaration of Independence",
        "Benjamin Franklin - Diplomat and inventor",
        "King George III - British monarch"
      ],
      mainThemes: [
        "Struggle for independence",
        "Formation of democratic principles",
        "Role of taxation without representation",
        "Importance of international alliances"
      ],
      lastingImpact: "Established the United States as an independent nation and influenced democratic movements worldwide."
    }
  }
};

// Keyword matching function
function getResponseType(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('quiz')) return 'quiz';
  if (lowerMessage.includes('lesson')) return 'lesson';
  if (lowerMessage.includes('assignment')) return 'assignment';
  if (lowerMessage.includes('project')) return 'project';
  if (lowerMessage.includes('worksheet')) return 'worksheet';
  if (lowerMessage.includes('summary')) return 'summary';
  if (lowerMessage.includes('help')) return 'help';

  return 'unknown';
}

// POST /api/chatbot
router.post('/', verifyToken, requireTeacher, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    const responseType = getResponseType(message);
    let response;

    if (responseType === 'help') {
      response = {
        type: 'text',
        content: `Welcome to the Teacher Assistant Chatbot! I can help you create content templates. Try asking for:

• "Create a quiz" - Get a sample quiz template
• "Create a lesson" - Get a sample lesson plan
• "Create an assignment" - Get a sample assignment template
• "Create a project" - Get a sample project template
• "Create a worksheet" - Get a sample worksheet template
• "Create a summary" - Get a sample summary template

All templates are ready to save directly to your content library!`
      };
    } else if (responseType === 'unknown') {
      response = {
        type: 'text',
        content: `I'm sorry, I didn't understand that request. Type "help" to see what I can assist you with, or try keywords like "quiz", "lesson", "assignment", "project", "worksheet", or "summary".`
      };
    } else {
      // Return content template
      const template = contentTemplates[responseType];
      response = {
        type: 'content',
        content: template
      };
    }

    // Optional: Log the interaction
    try {
      await Log.create({
        user: req.user.id,
        action: 'chatbot_interaction',
        content: message,
        type: responseType,
        metadata: {
          responseType: response.type,
          hasContent: response.type === 'content'
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    } catch (logError) {
      console.warn('Failed to log chatbot interaction:', logError.message);
    }

    res.json(response);

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

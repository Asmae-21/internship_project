db = db.getSiblingDB('auth-service');

// Create collections with indexes
db.createCollection('users');
db.createCollection('contents');
db.createCollection('logs');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.contents.createIndex({ "createdBy": 1 });
db.contents.createIndex({ "createdAt": -1 });
db.logs.createIndex({ "user": 1 });
db.logs.createIndex({ "createdAt": -1 });

// Insert test users
db.users.insertMany([
  {
    firstName: "Asmae",
    lastName: "Teacher",
    email: "asmae.teacher@example.com",
    phone: "+1234567890",
    classes: "Mathematics, Physics",
    subjects: "Advanced Calculus, Quantum Physics",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    photo: "/uploads/profile/1758563292277-158808321.png",
    role: "teacher",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    lastName: "Admin",
    firstName: "System",
    email: "admin@example.com",
    phone: "+1234567891",
    classes: "Administration",
    subjects: "System Management",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "admin",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert test content
db.contents.insertMany([
  {
    title: "Introduction to Calculus",
    description: "Basic concepts of differential and integral calculus",
    type: "Lesson",
    tags: ["mathematics", "calculus", "basics"],
    files: ["/uploads/content/1758480315330-408562835.pdf"],
    createdBy: ObjectId(), // Will be updated after users are inserted
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date()
  },
  {
    title: "Physics Lab Experiment",
    description: "Newton's laws of motion experiment",
    type: "Project",
    tags: ["physics", "experiment", "newton"],
    files: ["/uploads/content/1758561070732-246506514.png"],
    createdBy: ObjectId(), // Will be updated after users are inserted
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date()
  },
  {
    title: "Chemistry Quiz",
    description: "Periodic table and chemical reactions",
    type: "Quiz",
    tags: ["chemistry", "periodic table", "reactions"],
    files: [],
    createdBy: ObjectId(), // Will be updated after users are inserted
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    updatedAt: new Date()
  }
]);

// Update content createdBy references
const teacher = db.users.findOne({ role: "teacher" });
if (teacher) {
  db.contents.updateMany({}, { $set: { createdBy: teacher._id } });
}

// Insert test logs
db.logs.insertMany([
  {
    user: teacher._id,
    action: "Logged in",
    content: "User login",
    type: "Authentication",
    metadata: {},
    ipAddress: "127.0.0.1",
    userAgent: "Mozilla/5.0",
    createdAt: new Date()
  },
  {
    user: teacher._id,
    action: "Created content",
    content: "Introduction to Calculus",
    type: "Content",
    metadata: {
      description: "Basic concepts of differential and integral calculus",
      tags: ["mathematics", "calculus", "basics"],
      fileCount: 1
    },
    ipAddress: "127.0.0.1",
    userAgent: "Mozilla/5.0",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
]);

print("Database initialized with test data!");
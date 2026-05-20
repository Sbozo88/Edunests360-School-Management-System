const express = require("express");
const admin = require("firebase-admin");
const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");

admin.initializeApp();
setGlobalOptions({ region: "us-central1", maxInstances: 10 });

const db = admin.firestore();
const app = express();

app.use(express.json({ limit: "1mb" }));

const FIRST_NAMES = [
  "Sipho", "Thabo", "Lindiwe", "Naledi", "Zola", "Bongani", "Mandla", "Nomvula", "Zanele", "Sibusiso",
  "Lungile", "Themba", "Dumisani", "Nonhlanhla", "Nkosana", "Kagiso", "Karabo", "Tshepo", "Rethabile", "Mpho",
  "Kabelo", "Lerato", "Tumi", "Boipelo", "Neo", "Palesa", "Lehlohonolo", "Sello", "Katlego", "Thandi",
  "Liam", "Noah", "Ethan", "Oliver", "William", "James", "Lucas", "Benjamin", "Mason", "Jack",
  "Olivia", "Emma", "Ava", "Sophia", "Isabella", "Mia", "Charlotte", "Amelia", "Harper", "Evelyn",
  "Aarav", "Vihaan", "Arjun", "Sai", "Aditya", "Rohan", "Dev", "Krishna", "Ishaan", "Ananya",
  "Diya", "Aanya", "Saanvi", "Pari", "Riya", "Ira", "Zara", "Kiran", "Priya", "Raj",
  "Johan", "Pieter", "Jaco", "Francois", "Wian", "Stefan", "Anrich", "Ruan", "Elize",
  "Annelize", "Lize", "Chandre", "Marnel", "Hannelie", "Liezel", "Sunette", "Alisha", "Denzil", "Keanu",
  "Brandon", "Kayla", "Ashleigh", "Megan", "Tamara", "Nicolette", "Tebogo", "Kabelo", "Simphiwe", "Ayanda"
];

const SURNAMES = [
  "Mokoena", "Dlamini", "Naidoo", "Patel", "Khumalo", "Ndlovu", "Zulu", "Botha", "Smit", "Govender",
  "Pillay", "Nkosi", "Mthembu", "Sithole", "Zwane", "Mofokeng", "Mabaso", "Modise", "Sibanda", "Tshabalala",
  "Gumede", "Cele", "Singh", "Moodley", "Chetty", "Reddy", "Jacobs", "van Wyk", "Williams", "Pretorius",
  "Muller", "Nel", "du Plessis", "Steyn", "Coetzee", "Jansen", "Kruger", "Bothma", "Louw", "van der Merwe"
];

const INITIAL_STUDENTS = [
  { id: "RPS-001", name: "Sithembiso", class: "7T", parent: "RPS Parent 1", status: "Active", fee: "Paid", email: "sithembiso@rempark.co.za", attendance: 96 },
  { id: "RPS-002", name: "Siyamthanda", class: "7N", parent: "RPS Parent 2", status: "Active", fee: "Paid", email: "siyamthanda@rempark.co.za", attendance: 95 },
  { id: "RPS-003", name: "Sihle", class: "7S", parent: "RPS Parent 3", status: "Active", fee: "Pending", email: "sihle@rempark.co.za", attendance: 92 },
  { id: "RPS-004", name: "Shawn", class: "7A", parent: "RPS Parent 4", status: "Active", fee: "Pending", email: "shawn@rempark.co.za", attendance: 91 },
  { id: "RPS-005", name: "Lerato Mokoena", class: "4M", parent: "Thandi Mokoena", status: "Active", fee: "Paid", email: "lerato.mokoena@rempark.co.za", attendance: 94 },
  { id: "RPS-006", name: "Aarav Naidoo", class: "3N", parent: "Priya Naidoo", status: "Active", fee: "Overdue", email: "aarav.naidoo@rempark.co.za", attendance: 89 },
  { id: "RPS-007", name: "Amara Dlamini", class: "2S", parent: "Nomsa Dlamini", status: "Active", fee: "Paid", email: "amara.dlamini@rempark.co.za", attendance: 97 },
  { id: "RPS-008", name: "Mia Patel", class: "RA", parent: "Kiran Patel", status: "Active", fee: "Pending", email: "mia.patel@rempark.co.za", attendance: 93 }
];

const INITIAL_TEACHERS = [
  { id: "TCH-001", name: "Ms Seema", subject: "Principal", classes: ["School Management"], email: "pa@rempark.co.za", status: "Active" },
  { id: "TCH-002", name: "Ms Kendall", subject: "Deputy Principal", classes: ["Foundation Phase Oversight"], email: "kendall@rempark.co.za", status: "Active" },
  { id: "TCH-003", name: "Mr Chidi", subject: "Deputy Principal", classes: ["Intersen Phase Oversight"], email: "chidi@rempark.co.za", status: "Active" },
  { id: "TCH-004", name: "Ms Naicker", subject: "Departmental Head - Foundation Phase", classes: ["Grade R", "Grade 1"], email: "naicker@rempark.co.za", status: "Active" },
  { id: "TCH-005", name: "Ms Pope", subject: "Departmental Head - Foundation Phase", classes: ["Grade 2"], email: "pope@rempark.co.za", status: "Active" },
  { id: "TCH-006", name: "Ms Meikle", subject: "Departmental Head - Foundation Phase", classes: ["Grade 3"], email: "meikle@rempark.co.za", status: "Active" },
  { id: "TCH-007", name: "Ms Slaughter", subject: "Departmental Head - Intersen Phase", classes: ["Grade 4"], email: "slaughter@rempark.co.za", status: "Active" },
  { id: "TCH-008", name: "Ms Cierenberg", subject: "Departmental Head - Intersen Phase", classes: ["Grade 5", "Grade 6"], email: "cierenberg@rempark.co.za", status: "Active" },
  { id: "TCH-009", name: "Ms Vilakazi", subject: "Departmental Head - Intersen Phase", classes: ["Grade 7"], email: "vilakazi@rempark.co.za", status: "Active" },
  { id: "TCH-010", name: "Ms Maphutha", subject: "Media Centre", classes: ["Library", "Reading Support"], email: "maphutha@rempark.co.za", status: "Active" },
  { id: "TCH-011", name: "Mr Ndivhuwo", subject: "Media Centre", classes: ["Library", "Hooked on Books"], email: "ndivhuwo@rempark.co.za", status: "Active" },
  { id: "TCH-012", name: "Mr Mokoena", subject: "Computers", classes: ["Coding and Robotics"], email: "mokoena@rempark.co.za", status: "Active" },
  { id: "TCH-013", name: "Ms Masinga", subject: "Zulu Grades 1-3", classes: ["Grade 1 Zulu", "Grade 2 Zulu", "Grade 3 Zulu"], email: "masinga@rempark.co.za", status: "Active" },
  { id: "TCH-014", name: "Ms D'Aquino", subject: "Sport", classes: ["Soccer", "Netball", "Swimming"], email: "daquino@rempark.co.za", status: "Active" },
  { id: "TCH-015", name: "Mr Ngwenya", subject: "Music", classes: ["Music lessons", "Concerts"], email: "ngwenya@rempark.co.za", status: "Active" },
  { id: "TCH-016", name: "Ms Moshape", subject: "First Additional Language Grade 3", classes: ["Grade 3 FAL"], email: "moshape@rempark.co.za", status: "Active" }
];

const INITIAL_STAFF = [
  "Mr Skhosana", "Ms Ramarumo", "Mr Mathabatha", "Ms Mkhize", "Ms McGee", "Mr Makwarela", "Ms Waller",
  "Godfrey", "Sarah", "Alfred", "Lucas", "Anikie", "Sophy", "Evidence", "Ernest"
].map((name, index) => ({ id: `STF-${String(index + 1).padStart(3, "0")}`, name }));

const INITIAL_CLASSES = [
  ["CLS-RA", "RA", "SEC-FP", "TCH-004", "Room 5", "Foundation Phase"],
  ["CLS-RB", "RB", "SEC-FP", "TCH-004", "Room 6", "Foundation Phase"],
  ["CLS-1C", "1C", "SEC-FP", "TCH-004", "Room 1", "Foundation Phase"],
  ["CLS-1M", "1M", "SEC-FP", "TCH-004", "Room 7", "Foundation Phase"],
  ["CLS-1J", "1J", "SEC-FP", "TCH-004", "Room 8", "Foundation Phase"],
  ["CLS-1N", "1N", "SEC-FP", "TCH-004", "Room 9", "Foundation Phase"],
  ["CLS-1P", "1P", "SEC-FP", "TCH-004", "Room 10", "Foundation Phase"],
  ["CLS-2S", "2S", "SEC-FP", "TCH-005", "Room 2", "Foundation Phase"],
  ["CLS-2F", "2F", "SEC-FP", "TCH-005", "Room 31", "Foundation Phase"],
  ["CLS-2N", "2N", "SEC-FP", "TCH-005", "Room 32", "Foundation Phase"],
  ["CLS-2T", "2T", "SEC-FP", "TCH-005", "Room 33", "Foundation Phase"],
  ["CLS-3N", "3N", "SEC-FP", "TCH-006", "Room 3", "Foundation Phase"],
  ["CLS-3M", "3M", "SEC-FP", "TCH-006", "Room 4", "Foundation Phase"],
  ["CLS-3D", "3D", "SEC-FP", "TCH-006", "Room 29", "Foundation Phase"],
  ["CLS-3A", "3A", "SEC-FP", "TCH-006", "Room 30", "Foundation Phase"],
  ["CLS-4M", "4M", "SEC-IP", "TCH-007", "Room 11", "Intersen Phase"],
  ["CLS-4K", "4K", "SEC-IP", "TCH-007", "Room 12", "Intersen Phase"],
  ["CLS-4S", "4S", "SEC-IP", "TCH-007", "Room 13", "Intersen Phase"],
  ["CLS-4R", "4R", "SEC-IP", "TCH-007", "Room 14", "Intersen Phase"],
  ["CLS-5L", "5L", "SEC-IP", "TCH-008", "Room 16", "Intersen Phase"],
  ["CLS-5K", "5K", "SEC-IP", "TCH-008", "Room 17", "Intersen Phase"],
  ["CLS-5N", "5N", "SEC-IP", "TCH-008", "Room 18", "Intersen Phase"],
  ["CLS-5M", "5M", "SEC-IP", "TCH-008", "Room 26", "Intersen Phase"],
  ["CLS-6Z", "6Z", "SEC-IP", "TCH-008", "Room 23", "Intersen Phase"],
  ["CLS-6V", "6V", "SEC-IP", "TCH-008", "Room 24", "Intersen Phase"],
  ["CLS-6M", "6M", "SEC-IP", "TCH-008", "Room 25", "Intersen Phase"],
  ["CLS-6B", "6B", "SEC-IP", "TCH-008", "Room 27", "Intersen Phase"],
  ["CLS-7T", "7T", "SEC-IP", "TCH-009", "Room 15", "Intersen Phase"],
  ["CLS-7N", "7N", "SEC-IP", "TCH-009", "Room 19", "Intersen Phase"],
  ["CLS-7S", "7S", "SEC-IP", "TCH-009", "Room 20", "Intersen Phase"],
  ["CLS-7A", "7A", "SEC-IP", "TCH-009", "Room 21", "Intersen Phase"],
  ["CLS-7M", "7M", "SEC-IP", "TCH-009", "Room 22", "Intersen Phase"]
].map(([id, name, sectionId, teacherId, roomId, shift], index) => ({
  id, name, sectionId, teacherId, roomId, shift, sortOrder: index
}));

function getCAPSSubjects(className) {
  if (className.startsWith("R")) {
    return [
      { name: "English Home Language", teacherId: "TCH-004" },
      { name: "Mathematics", teacherId: "TCH-004" },
      { name: "Life Skills", teacherId: "TCH-004" }
    ];
  }

  const grade = Number.parseInt(className.charAt(0), 10);
  if (grade >= 1 && grade <= 3) {
    const mainTeacher = { 1: "TCH-004", 2: "TCH-005", 3: "TCH-006" }[grade] || "TCH-004";
    return [
      { name: "English Home Language", teacherId: mainTeacher },
      { name: "isiZulu First Additional Language", teacherId: "TCH-013" },
      { name: "Mathematics", teacherId: mainTeacher },
      { name: "Life Skills", teacherId: mainTeacher },
      { name: "Coding and Robotics", teacherId: "TCH-012" }
    ];
  }

  if (grade >= 4 && grade <= 6) {
    const mainTeacher = { 4: "TCH-007", 5: "TCH-008", 6: "TCH-008" }[grade] || "TCH-007";
    return [
      { name: "English Home Language", teacherId: mainTeacher },
      { name: "Afrikaans First Additional Language", teacherId: mainTeacher },
      { name: "Mathematics", teacherId: mainTeacher },
      { name: "Natural Sciences and Technology", teacherId: "TCH-012" },
      { name: "Social Sciences", teacherId: mainTeacher },
      { name: "Life Skills", teacherId: mainTeacher }
    ];
  }

  if (grade === 7) {
    return [
      { name: "English Home Language", teacherId: "TCH-009" },
      { name: "Afrikaans First Additional Language", teacherId: "TCH-009" },
      { name: "Mathematics", teacherId: "TCH-009" },
      { name: "Natural Sciences", teacherId: "TCH-009" },
      { name: "Social Sciences", teacherId: "TCH-009" },
      { name: "Technology", teacherId: "TCH-012" },
      { name: "Economic and Management Sciences (EMS)", teacherId: "TCH-009" },
      { name: "Creative Arts", teacherId: "TCH-015" },
      { name: "Life Orientation (LO)", teacherId: "TCH-009" },
      { name: "Physical Education", teacherId: "TCH-014" }
    ];
  }

  return [];
}

function avatar(name, index) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150&v=${index}`;
}

function monthFromDate(date = "") {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].find((month) => date.includes(month));
}

function asArray(snapshot) {
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getCollection(name) {
  const snapshot = await db.collection(name).get();
  return asArray(snapshot);
}

function paginate(rows, page, limit) {
  const total = rows.length;
  return {
    rows: rows.slice((page - 1) * limit, page * limit),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
}

function matchesSearch(row, search, fields) {
  if (!search) return true;
  const value = search.toLowerCase();
  return fields.some((field) => String(row[field] || "").toLowerCase().includes(value));
}

async function clearCollection(name) {
  const snapshot = await db.collection(name).get();
  let batch = db.batch();
  let count = 0;

  for (const doc of snapshot.docs) {
    batch.delete(doc.ref);
    count += 1;
    if (count % 450 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }

  if (count % 450 !== 0) {
    await batch.commit();
  }
}

async function writeDocs(collectionName, docs) {
  let batch = db.batch();
  let count = 0;

  for (const item of docs) {
    const ref = db.collection(collectionName).doc(item.id);
    batch.set(ref, item);
    count += 1;
    if (count % 450 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }

  if (count % 450 !== 0) {
    await batch.commit();
  }
}

async function seedDatabase() {
  const collections = ["students", "teachers", "classes", "subjects", "routines", "invoices", "staff"];
  for (const collectionName of collections) {
    await clearCollection(collectionName);
  }

  const subjects = [];
  const subjectsByClass = {};
  let subjectCount = 1;

  for (const cls of INITIAL_CLASSES) {
    const classSubjects = getCAPSSubjects(cls.name).map((subject) => {
      const id = `SUB-${String(subjectCount++).padStart(4, "0")}`;
      return { id, name: subject.name, classId: cls.id, teacherId: subject.teacherId };
    });
    subjectsByClass[cls.id] = classSubjects;
    subjects.push(...classSubjects);
  }

  const coreByClass = INITIAL_STUDENTS.reduce((acc, student) => {
    acc[student.class] = acc[student.class] || [];
    acc[student.class].push(student);
    return acc;
  }, {});

  const students = [];
  const invoices = [];
  let studentCount = 1;
  let invoiceCount = 1;

  for (const cls of INITIAL_CLASSES) {
    const className = cls.name;
    const section = className.charAt(className.length - 1) || "A";
    const coreStudents = coreByClass[className] || [];
    const targetTotal = 36;

    for (const core of coreStudents) {
      students.push({
        ...core,
        section,
        avatar: avatar(core.name, studentCount),
        sortOrder: studentCount
      });
      const status = core.fee || "Pending";
      invoices.push({
        id: `INV-${String(invoiceCount++).padStart(4, "0")}`,
        invoiceNo: `INV-${String(invoiceCount - 1).padStart(4, "0")}`,
        studentId: core.id,
        description: "School Fees",
        type: "School Fees",
        amount: status === "Pending" ? 7750 : 15500,
        status,
        date: status === "Pending" ? "08 Apr 2026" : "14 Jan 2026",
        sortOrder: invoiceCount
      });
    }

    for (let i = 0; i < targetTotal - coreStudents.length; i += 1) {
      const id = `RPS-${String(studentCount++).padStart(4, "0")}`;
      const firstName = FIRST_NAMES[(studentCount + i + cls.sortOrder) % FIRST_NAMES.length];
      const surname = SURNAMES[(studentCount * 3 + i + cls.sortOrder) % SURNAMES.length];
      const name = `${firstName} ${surname}`;
      const feeSelector = (studentCount + i + cls.sortOrder) % 10;
      const fee = feeSelector >= 9 ? "Overdue" : feeSelector >= 7 ? "Pending" : "Paid";
      const amount = fee === "Pending" ? 7750 : 15500;
      const date = fee === "Pending" ? "08 Apr 2026" : "14 Jan 2026";

      students.push({
        id,
        name,
        class: className,
        section,
        parent: `${FIRST_NAMES[(studentCount + 11) % FIRST_NAMES.length]} ${surname}`,
        email: `${firstName.toLowerCase()}.${surname.toLowerCase().replaceAll(" ", "")}@rempark.co.za`,
        status: feeSelector === 8 ? "Inactive" : "Active",
        attendance: 85 + ((studentCount + cls.sortOrder) % 15),
        fee,
        avatar: avatar(name, studentCount),
        sortOrder: studentCount
      });

      invoices.push({
        id: `INV-${String(invoiceCount++).padStart(4, "0")}`,
        invoiceNo: `INV-${String(invoiceCount - 1).padStart(4, "0")}`,
        studentId: id,
        description: "School Fees",
        type: "School Fees",
        amount,
        status: fee,
        date,
        sortOrder: invoiceCount
      });
    }
  }

  const routines = [];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = ["08:00 AM", "08:45 AM", "09:30 AM", "10:45 AM", "11:30 AM", "12:15 PM", "01:00 PM"];
  let routineCount = 1;

  for (const cls of INITIAL_CLASSES) {
    const classSubjects = subjectsByClass[cls.id] || [];
    let subjectIndex = 0;
    for (const day of days) {
      for (const period of periods) {
        const subject = classSubjects[subjectIndex % classSubjects.length];
        routines.push({
          id: `RT-${String(routineCount++).padStart(4, "0")}`,
          classId: cls.id,
          day,
          timeSlot: period,
          subjectId: subject.id,
          studentId: null,
          sortOrder: routineCount
        });
        subjectIndex += 1;
      }
    }

    students
      .filter((student) => student.class === cls.name)
      .slice(0, 2)
      .forEach((student, index) => {
        const subject = classSubjects[index % classSubjects.length];
        routines.push({
          id: `RT-${String(routineCount++).padStart(4, "0")}`,
          classId: cls.id,
          day: "Wednesday",
          timeSlot: index === 0 ? "08:45 AM" : "12:15 PM",
          subjectId: subject.id,
          studentId: student.id,
          sortOrder: routineCount
        });
      });
  }

  await writeDocs("classes", INITIAL_CLASSES);
  await writeDocs("teachers", INITIAL_TEACHERS);
  await writeDocs("staff", INITIAL_STAFF);
  await writeDocs("subjects", subjects);
  await writeDocs("students", students);
  await writeDocs("invoices", invoices);
  await writeDocs("routines", routines);

  return {
    classes: INITIAL_CLASSES.length,
    teachers: INITIAL_TEACHERS.length,
    staff: INITIAL_STAFF.length,
    students: students.length,
    subjects: subjects.length,
    invoices: invoices.length,
    routines: routines.length
  };
}

app.get("/api/db-seed", async (_req, res) => {
  try {
    const stats = await seedDatabase();
    res.json({
      success: true,
      message: `Firestore seeded with ${stats.students} learners, ${stats.subjects} CAPS subjects, and ${stats.routines} weekday routines.`,
      stats
    });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/classes", async (_req, res) => {
  try {
    const classes = (await getCollection("classes")).sort((a, b) => a.sortOrder - b.sortOrder);
    res.json(classes.map(({ sortOrder, ...cls }) => cls));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/classes", async (req, res) => {
  try {
    const data = req.body;
    const item = {
      id: data.id,
      name: data.name,
      sectionId: data.section_id ?? data.sectionId,
      teacherId: data.teacher_id ?? data.teacherId,
      roomId: data.room_id ?? data.roomId,
      shift: data.shift || "Morning"
    };
    await db.collection("classes").doc(item.id).set(item);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/teachers", async (_req, res) => {
  try {
    const teachers = (await getCollection("teachers")).sort((a, b) => a.name.localeCompare(b.name));
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/students/:id?", async (req, res) => {
  try {
    if (req.params.id) {
      const doc = await db.collection("students").doc(req.params.id).get();
      if (!doc.exists) return res.status(404).json({});
      return res.json({ id: doc.id, ...doc.data() });
    }

    const page = Number.parseInt(req.query.page || "1", 10);
    const limit = Number.parseInt(req.query.limit || "20", 10);
    const search = req.query.search || "";
    const classFilter = req.query.class || "";
    const gradeFilter = req.query.grade || "";
    const statusFilter = req.query.status || "";
    const feeFilter = req.query.fee || "";
    const students = (await getCollection("students"))
      .filter((student) => matchesSearch(student, search, ["name", "parent", "id", "email"]))
      .filter((student) => !classFilter || student.class === classFilter)
      .filter((student) => !gradeFilter || student.class.startsWith(gradeFilter))
      .filter((student) => !statusFilter || student.status === statusFilter)
      .filter((student) => !feeFilter || student.fee === feeFilter)
      .sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0));
    const { rows, pagination } = paginate(students, page, limit);
    res.json({ students: rows, pagination });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const data = req.body;
    await db.collection("students").doc(data.id).set({
      id: data.id,
      name: data.name,
      class: data.class,
      section: data.section,
      parent: data.parent,
      email: data.email,
      status: data.status || "Active",
      attendance: data.attendance || 0,
      avatar: data.avatar || null,
      fee: data.fee || "Pending"
    });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    await db.collection("students").doc(req.params.id).set({ ...req.body, id: req.params.id }, { merge: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const invoices = await db.collection("invoices").where("studentId", "==", req.params.id).get();
    const batch = db.batch();
    invoices.docs.forEach((doc) => batch.delete(doc.ref));
    batch.delete(db.collection("students").doc(req.params.id));
    await batch.commit();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/subjects/:id?", async (req, res) => {
  try {
    const classId = req.query.classId || "";
    const teachers = await getCollection("teachers");
    const teacherNames = Object.fromEntries(teachers.map((teacher) => [teacher.id, teacher.name]));
    const subjects = (await getCollection("subjects"))
      .filter((subject) => !classId || subject.classId === classId)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((subject) => ({ ...subject, teacherName: teacherNames[subject.teacherId] || null }));
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/subjects", async (req, res) => {
  try {
    const data = req.body;
    const item = {
      id: data.id,
      name: data.name,
      classId: data.class_id ?? data.classId,
      teacherId: data.teacher_id ?? data.teacherId ?? null
    };
    await db.collection("subjects").doc(item.id).set(item);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/subjects/:id", async (req, res) => {
  try {
    const routines = await db.collection("routines").where("subjectId", "==", req.params.id).get();
    const batch = db.batch();
    routines.docs.forEach((doc) => batch.delete(doc.ref));
    batch.delete(db.collection("subjects").doc(req.params.id));
    await batch.commit();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/routines/:id?", async (req, res) => {
  try {
    const classId = req.query.classId || "";
    const routines = (await getCollection("routines"))
      .filter((routine) => !classId || routine.classId === classId)
      .sort((a, b) => `${a.day}-${a.timeSlot}`.localeCompare(`${b.day}-${b.timeSlot}`));
    res.json(routines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/routines", async (req, res) => {
  try {
    const data = req.body;
    const item = {
      id: data.id,
      classId: data.class_id ?? data.classId,
      day: data.day,
      timeSlot: data.time_slot ?? data.timeSlot,
      subjectId: data.subject_id ?? data.subjectId,
      studentId: data.student_id ?? data.studentId ?? null
    };
    if (!item.id || !item.classId || !item.day || !item.timeSlot || !item.subjectId) {
      return res.status(400).json({ error: "Missing required routine fields: id, classId, day, timeSlot, subjectId" });
    }
    await db.collection("routines").doc(item.id).set(item);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/routines/:id", async (req, res) => {
  try {
    await db.collection("routines").doc(req.params.id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/invoices", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page || "1", 10);
    const limit = Number.parseInt(req.query.limit || "20", 10);
    const search = req.query.search || "";
    const statusFilter = req.query.status || "";
    const students = await getCollection("students");
    const studentNames = Object.fromEntries(students.map((student) => [student.id, student.name]));
    const invoices = (await getCollection("invoices"))
      .map((invoice) => ({
        ...invoice,
        invoiceNo: invoice.invoiceNo || invoice.id,
        studentName: studentNames[invoice.studentId] || invoice.studentId || "Unknown student"
      }))
      .filter((invoice) => matchesSearch(invoice, search, ["studentName", "studentId", "id"]))
      .filter((invoice) => !statusFilter || invoice.status === statusFilter)
      .sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0));
    const { rows, pagination } = paginate(invoices, page, limit);
    res.json({ invoices: rows, pagination });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/dashboard", async (_req, res) => {
  try {
    const [students, teachers, staff, invoices] = await Promise.all([
      getCollection("students"),
      getCollection("teachers"),
      getCollection("staff"),
      getCollection("invoices")
    ]);
    const studentNames = Object.fromEntries(students.map((student) => [student.id, student.name]));
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const totalRevenue = invoices
      .filter((invoice) => invoice.status === "Paid")
      .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);
    const financialData = months.map((month) => {
      const monthInvoices = invoices.filter((invoice) => monthFromDate(invoice.date) === month);
      return {
        name: month,
        income: monthInvoices.filter((invoice) => invoice.status === "Paid").reduce((total, invoice) => total + Number(invoice.amount || 0), 0),
        expense: monthInvoices.filter((invoice) => invoice.status !== "Paid").reduce((total, invoice) => total + Number(invoice.amount || 0), 0),
        students: students.length
      };
    });
    const recentCollections = invoices
      .filter((invoice) => invoice.status === "Paid")
      .sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0))
      .slice(0, 5)
      .map((invoice) => ({
        ...invoice,
        invoiceNo: invoice.invoiceNo || invoice.id,
        studentName: studentNames[invoice.studentId] || invoice.studentId || "Unknown student"
      }));

    res.json({
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalStaff: staff.length || 15,
      totalRevenue,
      recentCollections,
      financialData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

exports.api = onRequest({ timeoutSeconds: 300, memory: "1GiB" }, app);

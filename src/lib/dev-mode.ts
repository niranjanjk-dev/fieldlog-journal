import type { AppRole, Entry } from "./docko";
import type { Me, QueueEntry } from "./queries";

export type DevRole = "student" | "mentor" | "admin";

const DEV_MODE_KEY = "docko_dev_mode_enabled";
const DEV_ROLE_KEY = "docko_dev_role";

export function isDevModeActive(): boolean {
  if (typeof window === "undefined") return false;
  if (import.meta.env?.PROD) return false;
  const stored = localStorage.getItem(DEV_MODE_KEY);
  return stored !== "false"; // Default to true in dev mode only
}

export function setDevModeActive(active: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEV_MODE_KEY, active ? "true" : "false");
  window.dispatchEvent(new CustomEvent("docko:dev-mode-change", { detail: { active } }));
}

export function getDevRole(): DevRole {
  if (typeof window === "undefined") return "student";
  const stored = localStorage.getItem(DEV_ROLE_KEY);
  if (stored === "mentor" || stored === "admin" || stored === "student") return stored;
  return "student";
}

export function setDevRole(role: DevRole): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEV_ROLE_KEY, role);
  window.dispatchEvent(new CustomEvent("docko:dev-role-change", { detail: { role } }));
}

export const DEV_STUDENT: Me = {
  id: "a8003d09-d867-4311-948f-d9f1095c0674",
  email: "alex.rivera@stanford.edu",
  fullName: "Alex Rivera",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  headline: "Junior · Biomedical Engineering & Robotics",
  institution: "Stanford University",
  institutionId: null,
  institutionVerified: false,
  course: "BIO-402 Advanced Biomechanics",
  department: "Bioengineering Department",
  phone: null,
  position: null,
  hasChangedName: false,
  roles: ["student"],
};

export const DEV_MENTOR: Me = {
  id: "685a2b32-c0b4-4aea-a296-ecde68de8d34",
  email: "dr.vance@stanford.edu",
  fullName: "Dr. Elena Vance",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  headline: "Associate Professor & Lab Director",
  institution: "Stanford University",
  institutionId: null,
  institutionVerified: true,
  course: null,
  department: "Robotics Laboratory",
  phone: "+1 555-123-4567",
  position: "Senior Research Scientist",
  hasChangedName: false,
  roles: ["mentor"],
};

export const DEV_ADMIN: Me = {
  id: "e50bdb5e-9823-4d8b-bd3c-0feb2b2483ef",
  email: "dean.holloway@stanford.edu",
  fullName: "Dean Marcus Holloway",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  headline: "Dean of Academic Affairs & Accreditation",
  institution: "Stanford University",
  institutionId: null,
  institutionVerified: false,
  course: null,
  department: "Administration",
  phone: null,
  position: "Program Director",
  hasChangedName: false,
  roles: ["admin"],
};

export function getDevMe(role = getDevRole()): Me {
  if (role === "mentor") return DEV_MENTOR;
  if (role === "admin") return DEV_ADMIN;
  return DEV_STUDENT;
}

export const DEV_STUDENT_ENTRIES: Entry[] = [
  {
    id: "4d508a64-a590-499d-aca5-63db724637a6",
    student_id: "a8003d09-d867-4311-948f-d9f1095c0674",
    team_id: "05960b1f-baf5-43e5-bc2f-854c518b42a4",
    assigned_mentor_ids: ["685a2b32-c0b4-4aea-a296-ecde68de8d34", "dev-mentor-marcus"],
    assigned_mentors: ["Dr. Elena Vance", "Marcus Sterling"],
    title: "Micro-actuator calibration for prosthetic joint torque",
    category: "Hardware Testing",
    note: "Completed baseline current tests across 5 load cycles. Verified 0.02% error margin in telemetry feed.",
    photo_path: "samples/actuator-test.jpg",
    hours: 3.5,
    latitude: 37.4275,
    longitude: -122.1697,
    address: "Stanford Bioengineering Lab 4, Stanford, CA",
    captured_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "verified",
    review_note: "Calibration verified against sensor telemetry specs. Great progress on cycle 4.",
    reviewed_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "124e2583-a186-4e94-a87a-10e82c5a0b8b",
    student_id: "a8003d09-d867-4311-948f-d9f1095c0674",
    team_id: "05960b1f-baf5-43e5-bc2f-854c518b42a4",
    assigned_mentor_ids: ["685a2b32-c0b4-4aea-a296-ecde68de8d34"],
    assigned_mentors: ["Dr. Elena Vance"],
    title: "EMG sensor signal filtering and noise gate tuning",
    category: "Software Development",
    note: "Wrote bandpass filtering script in Python to eliminate 60Hz ambient electrical interference.",
    photo_path: "samples/emg-graph.jpg",
    hours: 2.5,
    latitude: 37.428,
    longitude: -122.17,
    address: "Clark Center Room S360, Stanford, CA",
    captured_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "verified",
    review_note: "Clean signal trace. Ready for real-time test.",
    reviewed_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7a05bf17-5ea0-46c7-8489-48aaa660fc77",
    student_id: "a8003d09-d867-4311-948f-d9f1095c0674",
    team_id: "05960b1f-baf5-43e5-bc2f-854c518b42a4",
    assigned_mentor_ids: ["685a2b32-c0b4-4aea-a296-ecde68de8d34", "dev-mentor-marcus"],
    assigned_mentors: ["Dr. Elena Vance", "Marcus Sterling"],
    title: "3D Print socket mount iteration 3 in carbon nylon",
    category: "Fabrication",
    note: "Print completed in 6.2 hours. Testing mechanical rigidity under compressive axial force.",
    photo_path: "samples/carbon-socket.jpg",
    hours: 4.0,
    latitude: 37.4272,
    longitude: -122.171,
    address: "Product Realization Lab, Stanford, CA",
    captured_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    review_note: null,
    reviewed_at: null,
  },
];

export const DEV_QUEUE_ENTRIES: QueueEntry[] = [
  {
    id: "8cc3e613-4f4d-4961-a990-f1643ae72d4c",
    student_id: "a8003d09-d867-4311-948f-d9f1095c0674",
    team_id: "05960b1f-baf5-43e5-bc2f-854c518b42a4",
    assigned_mentor_ids: ["685a2b32-c0b4-4aea-a296-ecde68de8d34", "dev-mentor-marcus"],
    assigned_mentors: ["Dr. Elena Vance", "Marcus Sterling"],
    title: "3D Print socket mount iteration 3 in carbon nylon",
    category: "Fabrication",
    note: "Print completed in 6.2 hours. Testing mechanical rigidity under compressive axial force.",
    photo_path: "samples/carbon-socket.jpg",
    hours: 4.0,
    latitude: 37.4272,
    longitude: -122.171,
    address: "Product Realization Lab, Stanford, CA",
    captured_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    review_note: null,
    reviewed_at: null,
    student: {
      full_name: "Alex Rivera",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      course: "BIO-402 Advanced Biomechanics",
    },
  },
  {
    id: "a675a2c3-542c-4185-8270-b6400271cebd",
    student_id: "6cb79b43-98ec-44ae-a2de-245a10e413ea",
    team_id: "f8eba1c1-9b76-45a6-81a1-9d3d27d35638",
    assigned_mentor_ids: ["685a2b32-c0b4-4aea-a296-ecde68de8d34"],
    assigned_mentors: ["Dr. Elena Vance"],
    title: "Autonomous path planner integration on quadcopter drone",
    category: "Hardware Testing",
    note: "Conducted 12 obstacle avoidance flight drills with ROS2 navigation stack. Zero collisions recorded.",
    photo_path: "samples/drone-flight.jpg",
    hours: 5.0,
    latitude: 37.426,
    longitude: -122.168,
    address: "Robotics Testing Grounds, Stanford, CA",
    captured_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    review_note: null,
    reviewed_at: null,
    student: {
      full_name: "Maya Chen",
      avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      course: "CS-237A Robot Navigation",
    },
  },
  {
    id: "a7834051-9e0a-419d-9db4-d95a0b7e4936",
    student_id: "a35a0fd7-a7fb-4da6-9e85-967dd49e740f",
    team_id: "75889d1a-f151-4dfd-8810-e367d9109f24",
    assigned_mentor_ids: ["685a2b32-c0b4-4aea-a296-ecde68de8d34"],
    assigned_mentors: ["Dr. Elena Vance"],
    title: "Tensile testing on heat-treated aluminum alloy 7075-T6",
    category: "Research",
    note: "Measured stress-strain curve up to yield point (510 MPa). Recorded elongation at break.",
    photo_path: "samples/tensile-test.jpg",
    hours: 3.0,
    latitude: 37.4285,
    longitude: -122.172,
    address: "Materials Science Testing Facility, Stanford, CA",
    captured_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    review_note: null,
    reviewed_at: null,
    student: {
      full_name: "Jordan Taylor",
      avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      course: "MSE-204 Mechanics of Materials",
    },
  },
];

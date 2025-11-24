const courseNameInput = document.querySelector('#courseNameInput');
const addCourseBtn = document.querySelector('#addCourseBtn');
const coursesList = document.querySelector('#coursesList');
const emptyState = document.querySelector('#emptyState');
const overallGPA = document.querySelector('#overallGPA');
const totalCourses = document.querySelector('#totalCourses');

let courses = [];

const getLetterGrade = (percentage) => {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
};

const getGPA = (percentage) => {
  // 10-point CGPA scale
  if (percentage >= 95) return 10.0;
  if (percentage >= 90) return 9.5;
  if (percentage >= 85) return 9.0;
  if (percentage >= 80) return 8.5;
  if (percentage >= 75) return 8.0;
  if (percentage >= 70) return 7.5;
  if (percentage >= 65) return 7.0;
  if (percentage >= 60) return 6.5;
  if (percentage >= 55) return 6.0;
  if (percentage >= 50) return 5.5;
  if (percentage >= 45) return 5.0;
  if (percentage >= 40) return 4.5;
  if (percentage >= 35) return 4.0;
  if (percentage >= 30) return 3.5;
  if (percentage >= 25) return 3.0;
  if (percentage >= 20) return 2.5;
  if (percentage >= 15) return 2.0;
  if (percentage >= 10) return 1.5;
  if (percentage >= 5) return 1.0;
  return 0.0;
};

const calculateCourseAverage = (course) => {
  if (course.assignments.length === 0) return null;

  let totalPoints = 0;
  let totalWeight = 0;

  course.assignments.forEach((assignment) => {
    const points = parseFloat(assignment.score) || 0;
    const weight = parseFloat(assignment.weight) || 0;
    totalPoints += points * weight;
    totalWeight += weight;
  });

  if (totalWeight === 0) return null;
  return totalPoints / totalWeight;
};

const updateOverallStats = () => {
  const coursesWithGrades = courses.filter((c) => {
    const avg = calculateCourseAverage(c);
    return avg !== null;
  });

  totalCourses.textContent = courses.length;

  if (coursesWithGrades.length === 0) {
    overallGPA.textContent = '0.00';
    return;
  }

  let totalGPA = 0;
  coursesWithGrades.forEach((course) => {
    const avg = calculateCourseAverage(course);
    totalGPA += getGPA(avg);
  });

  const overall = totalGPA / coursesWithGrades.length;
  overallGPA.textContent = overall.toFixed(2);
};

const deleteCourse = (courseId) => {
  courses = courses.filter((c) => c.id !== courseId);
  renderCourses();
  updateOverallStats();
};

const deleteAssignment = (courseId, assignmentId) => {
  const course = courses.find((c) => c.id === courseId);
  if (course) {
    course.assignments = course.assignments.filter((a) => a.id !== assignmentId);
    renderCourses();
    updateOverallStats();
  }
};

const addAssignment = (courseId, name, score, weight) => {
  const course = courses.find((c) => c.id === courseId);
  if (course) {
    const assignment = {
      id: Date.now() + Math.random(),
      name: name.trim(),
      score: parseFloat(score) || 0,
      weight: parseFloat(weight) || 0,
    };
    course.assignments.push(assignment);
    renderCourses();
    updateOverallStats();
  }
};

const renderCourse = (course) => {
  const avg = calculateCourseAverage(course);
  const letterGrade = avg !== null ? getLetterGrade(avg) : 'N/A';
  const gpa = avg !== null ? getGPA(avg).toFixed(2) : 'N/A';
  const percentage = avg !== null ? avg.toFixed(2) : 'N/A';

  const courseCard = document.createElement('div');
  courseCard.className = 'course-card';
  courseCard.innerHTML = `
    <div class="course-header">
      <div>
        <h3 class="course-name">${course.name}</h3>
        <div class="course-grades">
          <span class="grade-badge grade-badge--${getGradeClass(avg)}">
            ${letterGrade}
          </span>
          <span class="grade-text">${percentage}%</span>
          <span class="grade-text">CGPA: ${gpa}</span>
        </div>
      </div>
      <button class="btn-icon" data-action="delete-course" data-course-id="${course.id}" aria-label="Delete course">
        ×
      </button>
    </div>

    <div class="assignments-section">
      <h4 class="assignments-title">Assignments</h4>
      <div class="assignments-list" id="assignments-${course.id}">
        ${course.assignments.map((assignment) => `
          <div class="assignment-item">
            <div class="assignment-info">
              <span class="assignment-name">${assignment.name}</span>
              <span class="assignment-score">${assignment.score}% (Weight: ${assignment.weight}%)</span>
            </div>
            <button class="btn-icon btn-icon--small" data-action="delete-assignment" data-course-id="${course.id}" data-assignment-id="${assignment.id}" aria-label="Delete assignment">
              ×
            </button>
          </div>
        `).join('')}
      </div>

      <div class="add-assignment-form">
        <div class="form-row form-row--compact">
          <input
            type="text"
            class="input input--small"
            placeholder="Assignment name"
            data-course-id="${course.id}"
            data-field="name"
          />
          <input
            type="number"
            class="input input--small"
            placeholder="Score (%)"
            min="0"
            max="100"
            step="0.01"
            data-course-id="${course.id}"
            data-field="score"
          />
          <input
            type="number"
            class="input input--small"
            placeholder="Weight (%)"
            min="0"
            step="0.01"
            data-course-id="${course.id}"
            data-field="weight"
          />
          <button class="btn btn--small" data-action="add-assignment" data-course-id="${course.id}">
            Add
          </button>
        </div>
      </div>
    </div>
  `;

  return courseCard;
};

const getGradeClass = (percentage) => {
  if (percentage === null) return 'na';
  if (percentage >= 90) return 'excellent';
  if (percentage >= 80) return 'good';
  if (percentage >= 70) return 'average';
  if (percentage >= 60) return 'poor';
  return 'fail';
};

const renderCourses = () => {
  if (courses.length === 0) {
    emptyState.style.display = 'block';
    coursesList.innerHTML = '';
    coursesList.appendChild(emptyState);
    return;
  }

  emptyState.style.display = 'none';
  coursesList.innerHTML = '';
  courses.forEach((course) => {
    coursesList.appendChild(renderCourse(course));
  });

  attachEventListeners();
};

const attachEventListeners = () => {
  document.querySelectorAll('[data-action="delete-course"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const courseId = e.target.dataset.courseId;
      deleteCourse(courseId);
    });
  });

  document.querySelectorAll('[data-action="delete-assignment"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const courseId = e.target.dataset.courseId;
      const assignmentId = e.target.dataset.assignmentId;
      deleteAssignment(courseId, assignmentId);
    });
  });

  document.querySelectorAll('[data-action="add-assignment"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const courseId = e.target.dataset.courseId;
      const form = e.target.closest('.add-assignment-form');
      const nameInput = form.querySelector('[data-field="name"]');
      const scoreInput = form.querySelector('[data-field="score"]');
      const weightInput = form.querySelector('[data-field="weight"]');

      const name = nameInput.value.trim();
      const score = scoreInput.value;
      const weight = weightInput.value;

      if (name && score && weight) {
        addAssignment(courseId, name, score, weight);
        nameInput.value = '';
        scoreInput.value = '';
        weightInput.value = '';
      }
    });
  });

  document.querySelectorAll('.add-assignment-form input').forEach((input) => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const btn = input.closest('.add-assignment-form').querySelector('[data-action="add-assignment"]');
        btn.click();
      }
    });
  });
};

const addCourse = () => {
  const name = courseNameInput.value.trim();
  if (!name) return;

  const course = {
    id: Date.now(),
    name: name,
    assignments: [],
  };

  courses.push(course);
  courseNameInput.value = '';
  renderCourses();
  updateOverallStats();
};

addCourseBtn.addEventListener('click', addCourse);
courseNameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addCourse();
  }
});

renderCourses();
updateOverallStats();


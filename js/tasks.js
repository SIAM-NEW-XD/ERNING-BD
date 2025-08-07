document.addEventListener('DOMContentLoaded', function () {
  fetch('tasks.json')
    .then(response => response.json())
    .then(data => {
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = '';
      let count = 0;

      data.tasks.forEach((task, index) => {
        if (count >= 20) return;
        count++;

        const taskBox = document.createElement('div');
        taskBox.classList.add('task-box');

        taskBox.innerHTML = `
          <h3>${task.name}</h3>
          <button onclick="startTask('${task.link}', ${index})">Get Now</button>
          <div id="status-${index}"></div>
        `;

        taskList.appendChild(taskBox);
      });
    });
});

function startTask(link, index) {
  const status = document.getElementById(`status-${index}`);
  status.innerHTML = "Please wait 30 seconds...";

  setTimeout(() => {
    window.open(link, '_blank');
    status.innerHTML = "✅ Task Completed! You earned 2৳";
    saveBalance(2);
  }, 30000);
}

function saveBalance(amount) {
  let user = JSON.parse(localStorage.getItem('user'));
  user.balance = (user.balance || 0) + amount;
  localStorage.setItem('user', JSON.stringify(user));
}

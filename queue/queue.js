document.getElementById("btn").addEventListener("click", function () {
  setTimeout(async function () {
    const token = window.env.TOKEN; // Get token from preload.js
    const queueContainer = document.querySelector(".document-section ul");
    const searchInput = document.querySelector(".search-bar input");
    let tasks = [];

    if (!token) {
      console.error("No token found, please login first");
      return;
    }

    try {
      const userId = getUserIdFromToken(token) || 3;
      const response = await fetch(
        `https://etmf.somee.com/api/task/assigned/3`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 403) {
        alert("Not authorized to access this data");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      tasks = await response.json();
      console.log("Assigned Tasks:", tasks);

      renderTaskList(tasks);
    } catch (error) {
      console.error("Error fetching assigned tasks:", error);
    }

    function getUserIdFromToken(token) {
      return "currentUserId";
    }

    function renderTaskList(tasksToRender) {
      queueContainer.innerHTML = "";

      if (tasksToRender.length === 0) {
        queueContainer.innerHTML = "<li class='no-tasks'>No tasks found</li>";
        return;
      }

      tasksToRender.forEach((task) => {
        const li = document.createElement("li");
        li.dataset.taskId = task.documentId;

        li.innerHTML = `
                  <img src="./assests/folder.png" alt="folder-img">
                  <div class="task-details">
                      <p>${task.documentName}</p>
                      <div class="task-status">
                          <select class="status-dropdown" data-task-id="${
                            task.documentId
                          }">
                              <option value="pending" ${
                                task.status === "pending" ? "selected" : ""
                              }>Pending</option>
                              <option value="inProcess" ${
                                task.status === "inProcess" ? "selected" : ""
                              }>In Progress</option>
                              <option value="completed" ${
                                task.status === "completed" ? "selected" : ""
                              }>Completed</option>
                          </select>
                      </div>
                  </div>
              `;

        queueContainer.appendChild(li);
      });

      document.querySelectorAll(".status-dropdown").forEach((dropdown) => {
        dropdown.addEventListener("change", async (event) => {
          const taskId = event.target.dataset.taskId;
          const newStatus = event.target.value;
          await updateTaskStatus(taskId, newStatus);
        });
      });
    }

    async function updateTaskStatus(taskId, newStatus) {
      try {
        const response = await fetch(
          `https://etmf.somee.com/api/task/update-status/${taskId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ Status: newStatus }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log(`Task ${taskId} status updated to ${newStatus}`);

        const taskIndex = tasks.findIndex((t) => t.documentId === taskId);
        if (taskIndex !== -1) {
          tasks[taskIndex].status = newStatus;
        }

        alert(`Document status updated to ${newStatus} successfully!`);
      } catch (error) {
        console.error("Error updating task status:", error);
        alert("Failed to update document status. Please try again.");
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter((task) =>
          task.documentName.toLowerCase().includes(searchTerm)
        );
        renderTaskList(filteredTasks);
      });
    }
  }, 500);
});

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
      const userId = getUserIdFromToken(token) || 3; // Implement this function based on your token structure
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
      return "currentUserId"; // Replace with actual implementation
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

        // Fix: Display current status at the top of the dropdown
        // Make sure option values match exactly what the server expects
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

      // Add event listeners to status dropdowns after they are created
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

        // Update local tasks array to reflect the change
        const taskIndex = tasks.findIndex((t) => t.documentId === taskId);
        if (taskIndex !== -1) {
          tasks[taskIndex].status = newStatus;
        }

        // Show success notification
        alert(`Document status updated to ${newStatus} successfully!`);
      } catch (error) {
        console.error("Error updating task status:", error);
        alert("Failed to update document status. Please try again.");
      }
    }

    // Set up search functionality
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter((task) =>
          task.documentName.toLowerCase().includes(searchTerm)
        );
        renderTaskList(filteredTasks);
      });
    }
  }, 1000); // Delay execution by 1 second
});

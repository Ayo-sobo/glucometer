let lastUpdatedReading = null;

document.addEventListener("DOMContentLoaded", () => {
  const refreshButton = document.getElementById("refresh-button");
  const lastUpdated = document.getElementById("last-updated");
  const dataTable = document.getElementById("data-table");
  const loader = refreshButton.querySelector(".loader");

  function updateLastUpdated() {
    lastUpdated.textContent = `Last updated: ${new Date().toLocaleString()}`;
  }

  function fetchData() {
    loader.classList.remove("hidden");

    const requestBody = {
      filter: {},
      orderBy: "id",
      order: "DESC",
      pagination: {
        items_per_page: 20,
      },
    };

    fetch("https://nexus.drsavealife.com/glucometer/filter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "FAILED") {
          throw new Error(
            data.message || "An error occurred while fetching data."
          );
        }
        displayData(data.list);
        updateLastUpdated();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("An error occurred while fetching data. Please try again.");
      })
      .finally(() => {
        loader.classList.add("hidden");
      });
  }

  function displayData(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    data.forEach((item, index) => {
      const readings = JSON.parse(item.readings);
      const glucose = readings.glucose || "N/A";
      const deviceIMEI = readings.deviceimei || "N/A";

      const createdAt = new Date(item.createdAt);
      const formattedDate = createdAt.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const formattedTime = createdAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${index + 1}</td>
                <td>${deviceIMEI}</td>
                <td>${glucose}</td>
                <td>${formattedDate} ${formattedTime}</td> 
            `;

      if (!lastUpdatedReading || createdAt > new Date(lastUpdatedReading)) {
        row.classList.add("new-reading");
        lastUpdatedReading = createdAt;
      }

      tableBody.appendChild(row);
    });
  }

  refreshButton.addEventListener("click", fetchData);
  fetchData();
  setInterval(fetchData, 30000);
});

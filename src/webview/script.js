const ctx = document
  .getElementById("dependencyChart")
  .getContext("2d");

const labels = dependencyData.map(
  (d) => d.name
);

const sizes = dependencyData.map(
  (d) => d.size
);

const colors = dependencyData.map(
  (d) => d.color
);

const totalSize = sizes.reduce(
  (a, b) => a + b,
  0
);

const chart = new Chart(ctx, {

  type: "pie",

  data: {
    labels,

    datasets: [
      {
        data: sizes,

        backgroundColor: colors,

        borderWidth: 2,

        borderColor: "#000",

        hoverOffset: 12
      }
    ]
  },

  options: {

    responsive: true,

    animation: {

      animateRotate: true,

      animateScale: true,

      duration: 3500,

      easing: "easeOutQuart"
    },

    plugins: {

      legend: {
        display: false
      },

      tooltip: {

        callbacks: {

          label: function(context) {

            const value = context.raw;

            const percentage = (
              (value / totalSize) * 100
            ).toFixed(1);

            return `
${context.label}
${value} MB
(${percentage}%)
            `;
          }
        }
      }
    }
  }
});

const legend = document.getElementById(
  "legend"
);

dependencyData.forEach((dep, index) => {

  setTimeout(() => {

    const item =
      document.createElement("div");

    item.className = "legend-item";

    const percentage = (
      (dep.size / totalSize) * 100
    ).toFixed(1);

    item.innerHTML = `

      <div
        class="color-box"
        style="
          background:${dep.color}
        "
      ></div>

      <div class="dep-info">

        <div class="dep-name">
          ${dep.name}
        </div>

        <div class="dep-percent">
          ${percentage}%
        </div>

      </div>

      <div class="dep-size">
        ${dep.size} MB
      </div>
    `;

    legend.appendChild(item);

  }, 250 * index);
});
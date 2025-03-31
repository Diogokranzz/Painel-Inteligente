import Chart from "chart.js/auto";

// Helper function to get chart options based on chart type
const getChartOptions = (type: string) => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
  };

  // Additional specific options based on chart type
  switch (type) {
    case 'line':
      return {
        ...baseOptions,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
              color: 'rgba(226, 232, 240, 0.6)',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        interaction: {
          mode: 'nearest' as const,
          axis: 'x' as const,
          intersect: false,
        },
      };
    
    case 'bar':
      return {
        ...baseOptions,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
              color: 'rgba(226, 232, 240, 0.6)',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      };
    
    case 'doughnut':
      return {
        ...baseOptions,
        cutout: '70%',
        plugins: {
          ...baseOptions.plugins,
          legend: {
            position: 'bottom' as const,
            labels: {
              usePointStyle: true,
              boxWidth: 6,
              padding: 15,
            },
          },
        },
      };
    
    case 'horizontalBar':
      return {
        ...baseOptions,
        indexAxis: 'y' as const,
        plugins: {
          ...baseOptions.plugins,
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
              color: 'rgba(226, 232, 240, 0.6)',
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
      };
    
    default:
      return baseOptions;
  }
};

// Function to create/update chart
export const createChart = (
  ctx: CanvasRenderingContext2D,
  type: string,
  data: any,
  filter?: string
) => {
  // Apply any data modifications based on filter
  let chartData = { ...data };
  
  if (filter && type === 'line') {
    // Example: modify data points based on filter
    // In a real application, this would pull different data sets
    const multiplier = filter === 'weekly' ? 7 : filter === 'monthly' ? 30 : 1;
    
    if (chartData.datasets && chartData.datasets.length) {
      chartData.datasets = chartData.datasets.map((dataset: any) => ({
        ...dataset,
        data: dataset.data.map((value: number) => value * multiplier / 3),
      }));
    }
  }

  // Map chart type to Chart.js types
  let chartType: any;
  switch (type) {
    case 'line':
      chartType = 'line';
      break;
    case 'bar':
      chartType = 'bar';
      break;
    case 'doughnut':
      chartType = 'doughnut';
      break;
    case 'horizontalBar':
      chartType = 'bar'; // Bar chart with horizontal orientation via options
      break;
    default:
      chartType = type;
  }

  // Create chart
  return new Chart(ctx, {
    type: chartType,
    data: chartData,
    options: getChartOptions(type),
  });
};

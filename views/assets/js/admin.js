// Function to update the navigation bar based on user's login and admin status
function updateNavbar(isLoggedIn, isAdmin) {
  const storeInfoNavItem = document.getElementById("storeInfoNavItem");
  if (isLoggedIn && isAdmin) {
    storeInfoNavItem.style.display = "block";
  } else {
    storeInfoNavItem.style.display = "none";
  }
}

// Fetch user status and update navigation bar on page load
document.addEventListener("DOMContentLoaded", function() {
  fetch("/checkLoggedIn")
    .then(response => response.json())
    .then(data => {
      const isLoggedIn = data.isLoggedIn;
      const isAdmin = data.isAdmin; // This should be provided by your server response
      updateNavbar(isLoggedIn, isAdmin);
    })
    .catch(error => {
      console.error("Error checking session:", error);
    });
});

  // Add an event listener for form submission
  document.getElementById("addProductForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
   
    
    const formData = new FormData(event.target);
    
    //console.log("Form Data:",formData);
    //console.log("Form Data name:", formData.get("name"));
  
    const productData = {
      name: formData.get("name"),
      image:formData.get("image"),
      brand:formData.get("brand"),
      category:formData.get("category"),
      price: parseFloat(formData.get("price")),
      countInStock:parseInt(formData.get("countInStock")),
      rating: parseFloat(formData.get("rating")),
      numReviews:parseInt(formData.get("numReviews")),
      description: formData.get("description"),
      color: formData.get("color"),
      popularity: formData.get("popularity"),
    };
    await addProduct(productData);
     // Clear the form fields after successful product addition
  event.target.reset();
  });
  
   // Call a function to add the product using an API endpoint
  /*
   await addProduct(
    productData.name,
    productData.image,
    productData.brand,
    productData.category,
    productData.price,
    productData.countInStock,
    productData.rating,
    productData.numReviews,
    productData.description,
    productData.color,
    productData.popularity
  );
  */
   
   

  
  async function addProduct(productData) {
    try {
      const authToken = 'your-admin-auth-token'; // Replace with the actual admin authentication token

      const response = await fetch("/api/store-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`, // Include admin authentication token here
        },
        body: JSON.stringify(productData)
      });
  
      const data = await response.json();
      if (data.success) {
        // Update the product list on the admin page
      await updateProductList();
      } else {
        console.error("Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  }
/*
// Function to update the product list on the admin page
async function updateProductList() {
  try {
    const products = await fetchProducts(); // Fetch the updated list of products
    const productListElement = document.getElementById("productList");

    // Clear existing list
    productListElement.innerHTML = "";

    // Render the updated product list
    products.forEach(product => {
      const productItem = document.createElement("div");
      productItem.textContent = product.name; // Customize this to display relevant product information
      productListElement.appendChild(productItem);
    });
  } catch (error) {
    console.error("Error updating product list:", error);
  }
}

// Function to fetch the list of products from the server
async function fetchProducts() {
  try {
    const response = await fetch("/api/store-products");
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
*/
//Registers
  // Fetch user data from MongoDB using an API endpoint
  async function fetchUserData() {
    const response = await fetch('/api/store-user'); // Replace with your API endpoint
    const data = await response.json();
    return data;
}

// Function to render the user table
function renderUserTable(data) {
    const tableContainer = d3.select('#userTable');
    const table = tableContainer.append('table').attr('class', 'table');
    
    // Table header
    const thead = table.append('thead').append('tr');
    thead.append('th').text('ID');
    thead.append('th').text('Username');
    thead.append('th').text('Email');
    thead.append('th').text('Actions');

    // Table body
    const tbody = table.append('tbody');
    data.forEach(user => {
        const row = tbody.append('tr');
        row.append('td').text(user._id); // Assuming the user document has _id field
        row.append('td').text(user.name);
        row.append('td').text(user.email);
        const actionsCell = row.append('td');
        const deleteButton = actionsCell.append('button').attr('class', 'btn btn-danger').text('Delete');
        deleteButton.on('click', () => deleteUser(user._id)); // Call a function to delete the user
    });
}





// Function to delete a user
async function deleteUser(userId) {
const response = await fetch(`/api/store-user`, {
method: 'DELETE',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify({ _id: userId })
});

const data = await response.json();
if (data.success) {
// Reload the user table after successful deletion
const userData = await fetchUserData();
d3.select('#userTable').selectAll('*').remove(); // Clear existing table
renderUserTable(userData);
} else {
console.error('Failed to delete user.');
}
}


// Entry point: Fetch user data and render the user table
async function init() {
    const userData = await fetchUserData();
    renderUserTable(userData);
}

init(); // Initialize the script when the page loads





//D3
// Load data from the server (Product availability data)
d3.json("http://localhost:3330/api/store-products", function (error, data) {
  if (error) throw error;

  const products = data.map(item => ({ name: item.name, countInStock: item.countInStock }));

  // Create scales for X and Y values for the Scatter Plot
  const scatterPlotWidth = 1300;
  const scatterPlotHeight = 1000;

  const xScaleScatterPlot = d3.scaleLinear()
      .domain([0, d3.max(products, product => product.countInStock)])
      .range([0, scatterPlotWidth]);

  const yScaleScatterPlot = d3.scaleLinear()
      .domain([0, d3.max(products, product => product.countInStock)])
      .range([scatterPlotHeight, 0]);

  // Create SVG for the Scatter Plot
  const svgScatterPlot = d3.select("#scatter-plot")
      .attr("width", scatterPlotWidth)
      .attr("height", scatterPlotHeight);

  const chartGroupScatterPlot = svgScatterPlot.append("g")
      .attr("transform", `translate(40, 20)`);

  // Create X and Y axes for the Scatter Plot
  const xAxisScatterPlot = d3.axisBottom(xScaleScatterPlot);
  const yAxisScatterPlot = d3.axisLeft(yScaleScatterPlot);

  chartGroupScatterPlot.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${scatterPlotHeight})`)
      .call(xAxisScatterPlot);

  chartGroupScatterPlot.append("g")
      .attr("class", "y-axis")
      .call(yAxisScatterPlot);

  // Create circles for the Scatter Plot
  chartGroupScatterPlot.selectAll(".circle")
      .data(products)
      .enter().append("circle")
      .attr("class", "circle")
      .attr("cx", product => xScaleScatterPlot(product.countInStock))
      .attr("cy", product => yScaleScatterPlot(product.countInStock))
      .attr("r", 5);

  // Add text labels to the circles
  chartGroupScatterPlot.selectAll(".text-label")
      .data(products)
      .enter().append("text")
      .attr("class", "text-label")
      .attr("x", product => xScaleScatterPlot(product.countInStock) + 7)
      .attr("y", product => yScaleScatterPlot(product.countInStock) - 7)
      .text(product => product.name);

});


// Define the dimensions of the SVG canvas
const width = 1800; // גודל ה-SVG גדל ל-800
const height = 400;

// Create the SVG element
const svg = d3.select("#chart")
    .attr("width", width)
    .attr("height", height);

// Define the margins for the chart
const margin = { top: 20, right: 30, bottom: 50, left: 40 }; // שינוי בהגדרת הרגל תחתון
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Create scales for X and Y values
const xScale = d3.scaleBand()
    .range([0, innerWidth])
    .padding(0.1);

const yScale = d3.scaleLinear()
    .range([innerHeight, 0]);

// Create the chart group
const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load data from MongoDB
d3.json("http://localhost:3330/api/store-products", function(error, data) {
    if (error) throw error;

    // Create an array of product names and their corresponding prices
    const products = data.map(item => ({ name: item.name, price: item.price }));

    // Set domains for X and Y scales
    xScale.domain(products.map(product => product.name));
    yScale.domain([0, d3.max(products, product => product.price)]);

    // Create X and Y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(xAxis);

    chartGroup.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // Create bars for the products
    chartGroup.selectAll(".bar")
        .data(products)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", product => xScale(product.name))
        .attr("y", product => yScale(product.price))
        .attr("width", xScale.bandwidth())
        .attr("height", product => innerHeight - yScale(product.price));
});

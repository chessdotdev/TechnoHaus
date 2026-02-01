async function generateBuild() {
    const budget = document.getElementById("budget").value;
    const description = document.getElementById("description").value;
    const output = document.getElementById("output");
  
    output.innerHTML = "Loading...";
  
    try {
      const response = await fetch("https://technohaus.onrender.com/api/products/build", { // Replace with your backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ budget, description })
      });
  
      const data = await response.json();
      console.log(data); // Check the response in console
  
      if (!response.ok) {
        output.innerHTML = `<p class="error">${data.message}</p>`;
        return;
      }
  

      output.innerHTML = "";
  

      const img = document.createElement("img");
      img.src = data.data.image;
      img.alt = "PC Build Image";
      output.appendChild(img);
  
      // Add build specs
      const specs = document.createElement("div");
      specs.innerHTML = `
        <h3>Recommended Build</h3>
        <ul>
          <li><strong>CPU:</strong> ${data.data.CPU}</li>
          <li><strong>GPU:</strong> ${data.data.GPU}</li>
          <li><strong>RAM:</strong> ${data.data.RAM}</li>
          <li><strong>Storage:</strong> ${data.data.STORAGE}</li>
          <li><strong>Case:</strong> ${data.data.CASE}</li>
          <li><strong>Total Price:</strong> ${data.data.price} PHP</li>
        </ul>
      `;
      output.appendChild(specs);
  
    } catch (err) {
      console.error(err);
      output.innerHTML = `<p class="error">Failed to fetch build. Make sure your backend is running.</p>`;
    }
  }
  
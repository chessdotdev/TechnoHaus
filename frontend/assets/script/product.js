document.getElementById("addProducts-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get values by ID
    const CPU = document.getElementById("CPU").value;
    const GPU = document.getElementById("GPU").value;
    const RAM = document.getElementById("RAM").value;
    const STORAGE = document.getElementById("STORAGE").value;
    const PCCASE = document.getElementById("CASE").value;

    try {
      const response = await fetch("http://localhost:3000/api/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CPU,
          GPU,
          RAM,
          STORAGE,
          CASE: PCCASE
        }),
      });
      const data = await response.json()
      console.log(data);
      products()
      document.getElementById("addProducts-form").reset();
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong, please try again.");
    }

  });

  const products = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/products/get")
      const data = await response.json()
      const itemsContainer = document.querySelector(".items");

      // Clear container in case there are previous items
      itemsContainer.innerHTML = "";

      data.allProducts.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("productItem");
        productDiv.style.border = "1px solid #ccc";
        productDiv.style.padding = "10px";
        productDiv.style.margin = "10px 0";

        productDiv.innerHTML = `
                <h3>Product ID: ${product._id}</h3>
                <p><strong>CPU:</strong> <span class="cpu-text">${product.CPU}</span></p>
                <p><strong>GPU:</strong> <span class="gpu-text">${product.GPU}</span></p>
                <p><strong>RAM:</strong> <span class="ram-text">${product.RAM}</span></p>
                <p><strong>Storage:</strong> <span class="storage-text">${product.STORAGE}</span></p>
                <p><strong>Case:</strong> <span class="case-text">${product.CASE}</span></p>
                <button class="deleteBtn" data-id="${product._id}">Delete</button>
                <button class="editBtn" data-id="${product._id}">Edit</button>
                 <button class="saveBtn" style="display:none;">Save</button>

              `;
         const editBtn = productDiv.querySelector(".editBtn")
         const saveBtn = productDiv.querySelector(".saveBtn")
        const deleteProduct = productDiv.querySelector(".deleteBtn")

        editBtn.addEventListener('click',()=>{
          productDiv.querySelector(".cpu-text").innerHTML = `<input value="${product.CPU}">`;
          productDiv.querySelector(".gpu-text").innerHTML = `<input value="${product.GPU}">`;
          productDiv.querySelector(".ram-text").innerHTML = `<input value="${product.RAM}">`;
          productDiv.querySelector(".storage-text").innerHTML = `<input value="${product.STORAGE}">`;
          productDiv.querySelector(".case-text").innerHTML = `<input value="${product.CASE}">`;

          editBtn.style.display = "none";
          saveBtn.style.display = "block"
          deleteProduct.style.display = "none"
        });

        saveBtn.addEventListener('click', async ()=>{
          console.log(product._id);
            const updateData = {
              CPU: productDiv.querySelector('.cpu-text input').value,
              GPU: productDiv.querySelector(".gpu-text input").value,
              RAM: productDiv.querySelector(".ram-text input").value,
              STORAGE: productDiv.querySelector(".storage-text input").value,
              CASE: productDiv.querySelector(".case-text input").value,
            };

            try {
        
                const response = await fetch(`http://localhost:3000/api/products/updateProduct/${product._id}`,{
                 method: "PATCH",
                 headers: { 
                  "Content-Type": "application/json"
                 },
                 body: JSON.stringify(updateData)
                })

                const data = await response.json();
                console.log(data);
                
                alert(data.message)
                products()
              
            } catch (error) {
              console.error("Error updating product:", error);
              alert("Failed to update product.");
            }


        })

        deleteProduct.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            console.log(id)

            try {

              const deleteProduct = await fetch(`http://localhost:3000/api/products/deleteProduct/${id}`, {
                method: "DELETE"
              })
              const deleteData = await deleteProduct.json();
              alert(deleteData.message);
              products();
            } catch (error) {
              console.error("Error deleting product:", error);
              alert("Failed to delete product.");
            }

          });

        itemsContainer.appendChild(productDiv);


      });
    } catch (error) {

    }

  }



  const test = { CPU: "Intel i7", RAM: "16GB" };
  

  console.log(Object.keys(test));
  

  products()

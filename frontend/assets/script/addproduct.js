document.getElementById("addProducts-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const CPU = document.getElementById("CPU").value;
    const GPU = document.getElementById("GPU").value;
    const RAM = document.getElementById("RAM").value;
    const STORAGE = document.getElementById("STORAGE").value;
    const PCCASE = document.getElementById("CASE").value;
    const product_price = document.getElementById("product-price").value;
    const image = document.getElementById('product-image').value;
    const price = Number(product_price)

    try {
      const response = await fetch("https://technohaus.onrender.com/api/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CPU,
          GPU,
          RAM,
          STORAGE,
          CASE: PCCASE,
          price,
          image
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
      const response = await fetch("https://technohaus.onrender.com/api/products/get")
      const data = await response.json()
      const itemsContainer = document.querySelector(".items");

      itemsContainer.innerHTML = "";

      data.allProducts.forEach(product => {
        
        const productDiv = document.createElement("div");
        productDiv.classList.add("productItem");
        productDiv.style.border = "1px solid #ccc";
        productDiv.style.padding = "10px";
        productDiv.style.margin = "10px 0";

        productDiv.innerHTML = `
                <img src="${product.image}" alt="Product Image" style="max-width:100%; height:auto; border-radius:4px; margin-bottom:10px;">
                <p><strong>CPU:</strong> <span class="cpu-text">${product.CPU}</span></p>
                <p><strong>GPU:</strong> <span class="gpu-text">${product.GPU}</span></p>
                <p><strong>RAM:</strong> <span class="ram-text">${product.RAM}</span></p>
                <p><strong>Storage:</strong> <span class="storage-text">${product.STORAGE}</span></p>
                <p><strong>Case:</strong> <span class="case-text">${product.CASE}</span></p>
                <p><strong>Price:</strong> <span class="price-text">${product.price}</span></p>

                <button class="deleteBtn" data-id="${product._id}">Delete</button>
                <button class="editBtn" data-id="${product._id}">Edit</button>
                 <button class="saveBtn" style="display:none;">Save</button>

              `;
         const editBtn = productDiv.querySelector(".editBtn")
         const saveBtn = productDiv.querySelector(".saveBtn")
        const deleteProduct = productDiv.querySelector(".deleteBtn")

        editButton(editBtn, saveBtn, deleteProduct, productDiv, product);
        saveButton(saveBtn,productDiv,product);
        deleteButton(deleteProduct);

        itemsContainer.appendChild(productDiv);
      });
    } catch (error) {

    }

  }

function editButton(editBtn, saveBtn, deleteProduct, productDiv, product){
  editBtn.addEventListener('click',()=>{  
    
    const fields = ["CPU", "GPU", "RAM", "STORAGE", "CASE", "price"];

    fields.forEach(field =>{
      productDiv.querySelector(`.${field.toLocaleLowerCase()}-text`).innerHTML = `<input value="${product[field]}">`;
      console.log(product[field]);
      
    })
    editBtn.style.display = "none";
    saveBtn.style.display = "block"
    deleteProduct.style.display = "none"
  });

}

function saveButton(saveBtn, productDiv, product){
  saveBtn.addEventListener('click', async ()=>{
    console.log(product._id);
      const updateData = {
        CPU: productDiv.querySelector('.cpu-text input').value,
        GPU: productDiv.querySelector(".gpu-text input").value,
        RAM: productDiv.querySelector(".ram-text input").value,
        STORAGE: productDiv.querySelector(".storage-text input").value,
        CASE: productDiv.querySelector(".case-text input").value,
        price: Number(productDiv.querySelector(".price-text input").value),
      };

      try {
  
          const response = await fetch(`https://technohaus.onrender.com/api/products/updateProduct/${product._id}`,{
           method: "PATCH",
           headers: { 
            "Content-Type": "application/json"
           },
           body: JSON.stringify(updateData)
          })

          const data = await response.json();
          
          
          alert(data.message)
          products()
        
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product.");
      }
  })
}

function deleteButton(deleteProduct){
  deleteProduct.addEventListener('click', async (e) => {
    const id = e.target.getAttribute('data-id');
    console.log(id)

    try {

      const deleteProduct = await fetch(`https://technohaus.onrender.com/api/products/deleteProduct/${id}`, {
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
}


  products()

    // const test = { CPU: "Intel i7", RAM: "16GB" };
  // console.log(Object.keys(test));

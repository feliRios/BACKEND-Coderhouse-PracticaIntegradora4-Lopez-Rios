const socket = io();

let productsArray = [];

document.addEventListener("DOMContentLoaded", () => {
  socket.emit("getProducts");

  socket.on("productsData", (products) => {
    productsArray = products
    renderProducts(products);
  });
});

const renderProducts = (products) => {
    const productsContainer = document.querySelector(".grid-cols-1");
  
    productsContainer.innerHTML = "";
  
    products.forEach((product) => {
      const productBox = document.createElement("div");
      productBox.id = product._id;
      productBox.className = "bg-[#232323] w-96 rounded-xl p-6";
  
      productBox.innerHTML = `
        <div class="flex flex-col justify-center items-center">
          <img src="${product.thumbnail}" alt="" width="250" height="250" />
        </div>
        <h3 class="font-medium text-xl text-white text-center">${product.name}</h3>
        <h2 class="text-gray-200 font-semibold text-3xl mt-2 text-center">
          <span class="gradient-text">$${product.price}</span>
        </h2>
        <div class="w-full h-[1px] bg-gray-500 my-4"></div>
        <p class="font-medium text-base text-zinc-400 text-center mt-2">${product.description}</p>
        <p class="font-medium text-base text-zinc-400 text-center mt-2">${product.owner}</p>
        <div class="w-full h-[1px] bg-gray-500 my-4"></div>
        <button class="bg-red-500 hover:bg-black/20 transitions-all duration-200 w-full py-2 rounded-xl text-gray-200 font-medium" onclick="deleteProduct('${product._id}')">
          Eliminar
        </button>
      `;
  
      productsContainer.appendChild(productBox);
    });
  };

document.getElementById("newProductForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const code = document.getElementById("code").value;
    const category = document.getElementById("category").value;
    const stock = document.getElementById("stock").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const ownerId = document.getElementById("ownerId").value;

    const codeDuplicado = productsArray.some((product) => product.code === code);

    if (codeDuplicado) {
        Toastify({
            text: "No se puede agregar el producto. Ya existe un producto con el mismo código.",
            className: "error",
            newWindow: true,
            style: {
              background: "rgba(255, 0, 0, 0.2)",
              border: "1px solid #FF0000",
              borderRadius: "10px",
              fontSize: "12px",
            },
          }).showToast();
    } else {
        const newProduct = { name, description, price, code, stock, category, thumbnail, ownerId };
        socket.emit("addProduct", newProduct);
        e.target.reset();
        Toastify({
            text: 'Producto agregado correctamente!',
            className: "error",
            newWindow: true,
            style: {
              background: "rgba(43, 69, 186, 0.2)",
              border: "1px solid #2b45ba",
              borderRadius: "10px",
              fontSize: "12px",
            },
          }).showToast();
    }
});
  
  socket.on("productsData", (products) => {
    productsArray = products
    renderProducts(products);
  });

  const deleteProduct = (productId) => {
    Toastify({
        text: "Se elimino el producto correctamente!",
        className: "error",
        newWindow: true,
        style: {
          background: "rgba(255, 0, 0, 0.2)",
          border: "1px solid #FF0000",
          borderRadius: "10px",
          fontSize: "12px",
        },
      }).showToast();
      socket.emit("deleteProduct", productId);
  }

  socket.on("productDeleted", (productId) => {
    const deletedProductBox = document.getElementById(productId);
  
    if (deletedProductBox) {
      deletedProductBox.remove();
    } else {
      console.error("No se encontró el producto para eliminar eliminar");
    }
  });
  
  

const cafesList = document.getElementById("cafe-list");
const form = document.getElementById("add-cafe-form");

function renderList(_doc) {
  const li = document.createElement("li");
  const name = document.createElement("span");
  const location = document.createElement("span");
  const cross = document.createElement("div");
  li.setAttribute("data-id", _doc.id);
  cross.textContent = "x";
  name.textContent = _doc.data().name;
  location.textContent = _doc.data().location;
  li.appendChild(name);
  li.appendChild(location);
  li.appendChild(cross);
  cross.addEventListener("click", (e) => {
    e.stopPropagation();
    const id = e.target.parentElement.getAttribute("data-id");
    db.collection("cafes").doc(id).delete();
  });
  cafesList.appendChild(li);
}

// db.collection("cafes")
//   .get()
//   .then((snapshots) => {
//     snapshots.docs.forEach((_doc) => {
//       renderList(_doc);
//     });
//   });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("cafes").add({
    name: form.name.value,
    location: form.location.value,
  });
  form.name.value = "";
  form.location.value = "";
});

db.collection("cafes").onSnapshot((querySnapshot) => {
  querySnapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      renderList(change.doc);
    }
    if (change.type === "modified") {
      const elm = cafesList.querySelector("[data-id=" + change.doc.id + "]");
      cafesList.removeChild(elm);
      renderList(change.doc);
    }
    if (change.type === "removed") {
      const elm = cafesList.querySelector("[data-id=" + change.doc.id + "]");
      cafesList.removeChild(elm);
    }
  });
});

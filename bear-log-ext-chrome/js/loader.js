export function showLoader(value) {
    let filterButton = document.getElementById("filter");
    filterButton.disabled = value;
    filterButton.innerText = value ? "Loading..." : "Filter";
}
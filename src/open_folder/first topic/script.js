// Wait for the DOM to fully load before executing
document.addEventListener("DOMContentLoaded", () => {
  // Create and configure the title heading
  const title = document.createElement("h1");
  title.textContent = "Welcome";

  // Create and configure the description text
  const text = document.createElement("p");
  text.textContent = "This is a simple JavaScript page example.";

  // Create and configure the button with click handler
  const button = document.createElement("button");
  button.textContent = "Click me";
  button.addEventListener("click", () => {
    console.log("Button clicked");
  });

  // Append all elements to the document body
  document.body.append(title, text, button);
});

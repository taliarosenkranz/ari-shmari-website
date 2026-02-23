import Navigation from "../Navigation";

export default function NavigationExample() {
  return (
    <Navigation onBookDemo={() => console.log("Book demo clicked")} />
  );
}

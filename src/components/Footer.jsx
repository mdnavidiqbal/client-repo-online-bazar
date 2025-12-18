export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 p-6 mt-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        <div>
          <h2 className="font-bold mb-2">Contact</h2>
          <p>Email: support@localchefbazaar.com</p>
          <p>Phone: +880 123 456 789</p>
        </div>
        <div>
          <h2 className="font-bold mb-2">Working Hours</h2>
          <p>Mon - Sat: 9am - 9pm</p>
          <p>Sun: Closed</p>
        </div>
        <div>
          <h2 className="font-bold mb-2">Social</h2>
          <p>Facebook | Instagram | Twitter</p>
        </div>
      </div>
      <p className="text-center mt-6">© 2025 LocalChefBazaar. All rights reserved.</p>
    </footer>
  );
}

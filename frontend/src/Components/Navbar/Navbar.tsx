import { Link } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import { useState } from "react";

interface Props {}

const Navbar = (props: Props) => {
	const { isLoggedIn, user, logout } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<nav className="relative w-full p-4 bg-gradient-to-r from-pink-300 via-teal-250 to-orange-200">
			<div className="flex items-center justify-between w-full py-4">
				{/* Logo and Navigation Links */}
				<div className="flex items-center space-x-6">
					<div className="font-bold">
						<Link
							to="/"
							className="text-slate-700 text-3xl hover:opacity-80 transition-opacity duration-300"
						>
							TODO List
						</Link>
					</div>
				</div>

				{/* Hamburger Menu for Mobile */}
				<div className="lg:hidden flex items-center">
					<button
						className="text-slate-700 text-3xl"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						&#9776;
					</button>
				</div>

				{/* Menu for Desktop */}
				<div className="hidden lg:flex lg:items-center text-gray-900">
					{/* Conditional Rendering for Authenticated User */}
					{isLoggedIn() ? (
						<div className="flex items-center space-x-6 text-gray-900">
							<div className="text-xl font-semibold hover:text-teal-600 transition-all duration-300">
								Welcome, {user?.username}
							</div>
							<div className="flex items-center space-x-4 font-bold text-gray-900">
								<Link
									to="/tasks"
									className="px-8 py-3 font-bold rounded-full text-slate-700 bg-gradient-to-r from-violet-500 to-fuchsia-400 hover:opacity-80 transition-opacity duration-300"
								>
									My List
								</Link>
								<a
									onClick={logout}
									className="px-8 py-3 font-bold rounded-full bg-gradient-to-r from-orange-500 to-amber-400 hover:opacity-80 transition-opacity duration-300"
								>
									Logout
								</a>
							</div>
						</div>
					) : (
						<div className="flex items-center space-x-6 font-bold text-gray-900">
							<Link
								to="/login"
								className="hover:text-teal-600 transition-all duration-300"
							>
								Login
							</Link>
							<Link
								to="/register"
								className="px-8 py-3 font-bold rounded-full text-slate-700 bg-gradient-to-r from-cyan-600 to-teal-400 hover:opacity-80 transition-opacity duration-300"
							>
								Sign Up
							</Link>
						</div>
					)}
				</div>
			</div>

			{/* Mobile Dropdown Menu */}
			<div
				className={`lg:hidden ${
					isMenuOpen ? "block" : "hidden"
				}  p-2 text-center`}
			>
				{/* Conditional Rendering for Authenticated User */}
				{isLoggedIn() ? (
					<div className="flex justify-center items-center w-full h-full">
						<div className="flex flex-col px-3 w-1/3 font-semibold">
							Welcome, {user?.username}
						</div>
						<div className="space-x-3">
							<Link
								to="/tasks"
								className="px-6 py-2 font-bold text-sm rounded-full text-slate-700 bg-gradient-to-r from-violet-500 to-fuchsia-400 hover:opacity-80 transition-opacity duration-300"
							>
								My List
							</Link>
							<a
								onClick={logout}
								className="px-6 py-2 font-bold text-sm rounded-full text-slate-700 bg-gradient-to-r from-orange-500 to-amber-400 hover:opacity-80 transition-opacity duration-300"
							>
								Logout
							</a>
						</div>
					</div>
				) : (
					<div className="flex justify-center items-center w-full h-full">
						<div className="flex flex-col space-y-4 w-1/3">
							<Link
								to="/login"
								className="px-6 py-2 font-bold text-sm rounded-full text-slate-700 bg-gradient-to-r from-pink-500 to-rose-300 hover:opacity-80 transition-opacity duration-300"
							>
								Login
							</Link>
							<Link
								to="/register"
								className="px-6 py-2 font-bold text-sm rounded-full text-slate-700 bg-gradient-to-r from-cyan-600 to-teal-400 hover:opacity-80 transition-opacity duration-300"
							>
								Sign Up
							</Link>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;

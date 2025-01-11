import { Link } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import { useState } from "react";

interface Props {}

const Navbar = (_props: Props) => {
	const { isLoggedIn, user, logout } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<nav className="relative w-full p-4 bg-gradient-to-r from-indigo-950 via-teal-250 to-purple-800">
			<div className="flex items-center justify-between w-full py-4">
				{/* Logo and Navigation Links */}
				<div className="flex items-center space-x-6">
					<div className="font-bold">
						<Link
							to="/"
							className="text-purple-300 text-3xl hover:opacity-80 transition-opacity duration-300"
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
						<div className="flex items-center space-x-6 text-purple-300">
							<div className="text-xl font-semibold hover:opacity-80 transition-opacity duration-300">
								{user?.username}
							</div>
							<div className="flex items-center space-x-4 font-bold text-white">
								<Link
									to="/tasks"
									className="px-8 py-3 font-bold rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-80 transition-opacity duration-300"
								>
									My List
								</Link>
								<a
									onClick={logout}
									className="px-8 py-3 font-bold rounded-full bg-gradient-to-r from-slate-900 to-slate-600 hover:opacity-80 transition-opacity duration-300"
								>
									Logout
								</a>
							</div>
						</div>
					) : (
						<div className="flex items-center space-x-6 font-bold text-white">
							<Link
								to="/login"
								className="hover:text-teal-400 transition-all duration-300"
							>
								Login
							</Link>
							<Link
								to="/register"
								className="px-8 py-3 font-bold rounded-full bg-gradient-to-r from-cyan-800 to-teal-500 hover:opacity-80 transition-opacity duration-300"
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
						<div className="flex flex-col px-3 w-1/3 font-semibold text-purple-300">
							<div>{user?.username}</div>
						</div>
						<div className="space-x-3 text-white">
							<Link
								to="/tasks"
								className="px-6 py-2 font-bold text-sm rounded-full  bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-80 transition-opacity duration-300"
							>
								My List
							</Link>
							<a
								onClick={logout}
								className="px-6 py-2 font-bold text-sm rounded-full  bg-gradient-to-r from-slate-900 to-slate-600  hover:opacity-80 transition-opacity duration-300"
							>
								Logout
							</a>
						</div>
					</div>
				) : (
					<div className="flex justify-center items-center w-full h-full text-white">
						<div className="flex flex-col space-y-4 w-1/3">
							<Link
								to="/login"
								className="px-6 py-2 font-bold text-sm rounded-full bg-gradient-to-r from-pink-800 to-rose-500 hover:opacity-80 transition-opacity duration-300"
							>
								Login
							</Link>
							<Link
								to="/register"
								className="px-6 py-2 font-bold text-sm rounded-full  bg-gradient-to-r from-cyan-800 to-teal-500  hover:opacity-80 transition-opacity duration-300"
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

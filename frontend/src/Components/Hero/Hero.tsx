import { Link } from "react-router-dom";

interface Props {}

const Hero = (props: Props) => {
	return (
		<section
			id="hero"
			className="h-screen w-full bg-gradient-to-r from-pink-300 via-teal-250 to-orange-200 flex items-center"
		>
			<div className="container mx-auto flex flex-col-reverse lg:flex-row items-center px-8 lg:px-28 h-full">
				<div className="flex flex-col space-y-10 mb-20 lg:w-1/2 h-full align-middle justify-center text-center lg:text-left">
					<h1 className="text-3xl lg:text-5xl font-extrabold text-slate-700 text-wrap leading-tight">
						My TODO List
					</h1>
					<p className="text-lg lg:text-xl text-slate-700">
						Organize your tasks and stay productive with ease
					</p>
					<div className="mx-auto lg:mx-0">
						<Link
							to="/login"
							className="py-3 px-6 text-lg font-semibold text-slate-700 bg-gradient-to-r from-cyan-600 to-teal-400  rounded-lg hover:shadow-xl transition-shadow duration-300 shadow-md"
						>
							Get Started
						</Link>
					</div>
				</div>
				<div className="lg:w-1/2 flex justify-center lg:justify-end">
					<img
						src="https://via.placeholder.com/400" // Replace with your image source
						alt="TODO App Image"
						className="w-full max-w-xs lg:max-w-sm"
					/>
				</div>
			</div>
		</section>
	);
};

export default Hero;

"use client";

import { motion } from "framer-motion";

// Card thống kê có animation
export default function DashboardCard({ title, value, icon, gradient }) {
	return (
		<motion.div
			className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-xl bg-gradient-to-br ${gradient}`}
			whileHover={{ y: -4 }}
		>
			<div className="absolute -right-5 -top-5 opacity-10 text-8xl">{icon}</div>
			<div className="relative z-10">
				<h4 className="text-sm font-medium opacity-80">{title}</h4>
				<h2 className="mt-2 text-4xl font-black">{value}</h2>
			</div>
		</motion.div>
	);
}

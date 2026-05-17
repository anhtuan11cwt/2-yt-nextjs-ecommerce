"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";

const Search = () => {
	const router = useRouter();

	const inputRef = useRef(null);

	const [open, setOpen] = useState(false);
	const [keyword, setKeyword] = useState("");

	useEffect(() => {
		if (open && inputRef.current) {
			inputRef.current.focus();
		}
	}, [open]);

	const handleSearch = (e) => {
		e.preventDefault();

		if (!keyword.trim()) return;

		router.push(`/shop?q=${keyword}`);

		setOpen(false);
	};

	return (
		<>
			<button
				className="
          text-gray-600
          hover:text-primary
          transition-all
          duration-300
          cursor-pointer
        "
				onClick={() => setOpen(true)}
				type="button"
			>
				<IoSearchOutline size={24} />
			</button>

			{open && (
				<div
					className="
            fixed
            inset-0
            bg-black/40
            z-50
            flex
            justify-center
            items-start
            pt-20
            px-4
          "
				>
					<button
						aria-label="Close search overlay"
						className="absolute inset-0 cursor-default"
						onClick={() => setOpen(false)}
						type="button"
					/>
					<div
						className="
              relative
              bg-white
              w-full
              max-w-2xl
              rounded-2xl
              shadow-2xl
              p-4
              animate-in
              fade-in
              zoom-in-95
              duration-300
            "
					>
						<form className="flex items-center gap-3" onSubmit={handleSearch}>
							<input
								className="
                  w-full
                  h-12
                  px-4
                  rounded-xl
                  border
                  outline-none
                  focus:border-primary
                  transition-all
                  duration-300
                "
								onChange={(e) => setKeyword(e.target.value)}
								placeholder="Tìm kiếm sản phẩm..."
								ref={inputRef}
								type="text"
								value={keyword}
							/>

							<button
								className="
                  h-12
                  px-5
                  rounded-xl
                  bg-primary
                  text-white
                  hover:opacity-90
                  transition-all
                  duration-300
                  cursor-pointer
                "
								type="submit"
							>
								<IoSearchOutline size={22} />
							</button>
							<button
								aria-label="Close search"
								className="
                  h-12
                  w-12
                  flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-gray-100
                  text-gray-600
                  hover:bg-gray-200
                  transition-all
                  duration-300
                  cursor-pointer
                "
								onClick={() => setOpen(false)}
								type="button"
							>
								<IoCloseOutline size={24} />
							</button>
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default Search;

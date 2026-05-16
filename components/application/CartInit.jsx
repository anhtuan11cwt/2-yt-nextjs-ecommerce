"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartFromServer } from "@/redux/features/cartSlice";

const CartInit = () => {
	const dispatch = useDispatch();
	const token = useSelector((store) => store.auth?.token);
	const localCart = useSelector((store) => store.cart.cart);

	useEffect(() => {
		if (!token) return;
		if (localCart.length === 0) {
			dispatch(fetchCartFromServer());
		}
	}, [token, localCart.length, dispatch]);

	return null;
};

export default CartInit;

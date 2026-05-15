import he from "he";
import sanitizeHtml from "sanitize-html";

// Cấu hình sanitize HTML cho phép thẻ và thuộc tính an toàn
const sanitizeOptions = {
	allowedAttributes: {
		...sanitizeHtml.defaults.allowedAttributes,
		a: ["href", "name", "target", "rel"],
		img: ["src", "alt", "width", "height"],
	},
	allowedTags: [
		...sanitizeHtml.defaults.allowedTags,
		"figcaption",
		"figure",
		"h1",
		"h2",
		"h3",
		"h4",
		"img",
		"span",
	],
};

/** Chuẩn hóa HTML từ editor: sanitize rồi encode entity trước khi lưu DB */
export function prepareDescriptionForStorage(rawHtml) {
	const cleaned = sanitizeHtml(rawHtml || "", sanitizeOptions);
	return he.encode(cleaned);
}

/** Giải mã để đưa vào CKEditor hoặc render */
export function decodeDescriptionFromStorage(stored) {
	if (!stored) {
		return "";
	}
	return he.decode(stored);
}

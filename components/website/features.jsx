import {
  TbDiscount,
  TbHeadset,
  TbRefresh,
  TbTruckDelivery,
} from "react-icons/tb";

const features = [
  {
    description: "Đổi trả dễ dàng trong vòng 7 ngày",
    icon: TbRefresh,
    title: "Đổi Trả 7 Ngày",
  },
  {
    description: "Miễn phí vận chuyển cho mọi đơn hàng",
    icon: TbTruckDelivery,
    title: "Miễn Phí Vận Chuyển",
  },
  {
    description: "Hỗ trợ mọi lúc mọi nơi",
    icon: TbHeadset,
    title: "Hỗ Trợ 24/7",
  },
  {
    description: "Giảm giá đặc biệt cho thành viên",
    icon: TbDiscount,
    title: "Ưu Đãi Thành Viên",
  },
];

export default function Features() {
  return (
    <section className="w-full py-16 border-t bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                className="border rounded-3xl p-6 hover:shadow-lg transition-all duration-300 bg-white"
                key={item.title}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <Icon className="text-primary" size={30} />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-neutral-500 leading-7">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

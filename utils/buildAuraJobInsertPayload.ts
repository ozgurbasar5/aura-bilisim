/**
 * aura_jobs insert/update ile uyumlu minimum alan seti.
 * Atölye detay (epanel/atolye/[id]) kaydet payload'ı ile aynı sözleşme.
 */
export type AuraJobInsertInput = {
  customer: string;
  email?: string;
  phone?: string;
  address?: string;
  customer_type?: string;
  device: string;
  category?: string;
  serial_no?: string;
  password?: string;
  issue?: string;
  technician_note?: string;
  private_note?: string;
  status?: string;
  price?: string | number;
  cost?: number;
  tracking_code: string;
  payment_status?: string;
  tip_id?: string;
  approval_status?: string;
  approval_amount?: string | number;
  approval_desc?: string;
};

export function buildAuraJobInsertPayload(input: AuraJobInsertInput) {
  const now = new Date().toISOString();
  const emptyLists = "[]";
  const privateBase =
    input.private_note != null && input.private_note.includes("|||")
      ? input.private_note
      : `${input.private_note ?? ""}|||${emptyLists}`;

  return {
    customer: input.customer,
    email: input.email ?? "",
    phone: input.phone ?? "",
    address: input.address ?? "",
    customer_type: input.customer_type ?? "Son Kullanıcı",
    device: input.device,
    category: input.category ?? "Cep Telefonu",
    serial_no: input.serial_no ?? "",
    password: input.password ?? "",
    issue: input.issue ?? "",
    technician_note: input.technician_note ?? "",
    private_note: privateBase,
    status: input.status ?? "Bekliyor",
    price: String(Number(input.price != null ? input.price : 0) || 0),
    cost: Number(input.cost != null ? input.cost : 0) || 0,
    tracking_code: input.tracking_code,
    payment_status: input.payment_status ?? "unpaid",
    accessories: emptyLists,
    pre_checks: emptyLists,
    final_checks: emptyLists,
    images: emptyLists,
    recommended_upsells: emptyLists,
    sold_upsells: emptyLists,
    tip_id: input.tip_id ?? "genel",
    approval_status: input.approval_status ?? "none",
    approval_amount: String(Number(input.approval_amount != null ? input.approval_amount : 0) || 0),
    approval_desc: input.approval_desc ?? "",
    updated_at: now,
  };
}

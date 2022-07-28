import { jest } from '@jest/globals';
import voucherService from '../../src/services/voucherService';
import voucherRepository from '../../src/repositories/voucherRepository';

describe("voucherService test suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create a voucher", async () => {
    const code = "TEST";
    const discount = 10;
    const voucher = { id: 1, code, discount, used: false };

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValue(null);
    jest.spyOn(voucherRepository, "createVoucher").mockResolvedValue(voucher);

    const result = await voucherService.createVoucher(code, discount);

    expect(result).toBe(undefined);
  })
  it("should throw an error when voucher already exist", async () => {
    const code = "TEST";
    const discount = 10;
    const voucher = { id: 1, code, discount, used: false };

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValue(voucher);

    await expect(voucherService.createVoucher(code, discount)).rejects.toEqual({
      message: "Voucher already exist.",
      type: "conflict"
    })
  });
  it("should apply a voucher", async () => {
    const code = "TEST";
    const discount = 10;
    const amount = 1000;
    const voucher = { id: 1, code, discount, used: false };

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValue(voucher);
    jest.spyOn(voucherRepository, "useVoucher").mockResolvedValue(voucher);

    const result = await voucherService.applyVoucher(code, amount);

    expect(result).toEqual({
      amount,
      discount,
      finalAmount: 900,
      applied: true
    });
  });
  it("should throw an error when voucher does not exist", async () => {
    const code = "TEST";
    const amount = 1000;

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValue(null);

    await expect(voucherService.applyVoucher(code, amount)).rejects.toEqual({
      message: "Voucher does not exist.",
      type: "conflict"
    })
  });
})
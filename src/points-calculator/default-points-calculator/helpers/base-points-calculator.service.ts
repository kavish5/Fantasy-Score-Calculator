export abstract class BasePointsCalculatorService {
  protected getSlot(slots: any, value: number) {
    const slot = slots.find((item: any) => {
      let flag = false;
      if (item.above && item.below) {
        if (item.above <= value && item.below >= value) {
          flag = true;
        }
      } else {
        if (item.above && item.above <= value) {
          flag = true;
        }
        if (item.below && item.below >= value) {
          flag = true;
        }
      }
      return flag;
    });
    return slot;
  }
}

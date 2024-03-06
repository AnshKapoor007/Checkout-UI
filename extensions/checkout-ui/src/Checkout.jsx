import {
  Button,
  Heading,
  TextField,
  BlockStack,
  reactExtension,
  Grid,
  useApi,
  useApplyDiscountCodeChange,
  View,
  Banner,
  InlineStack
} from '@shopify/ui-extensions-react/checkout';
import { useState } from 'react';

export default reactExtension(
  'purchase.checkout.contact.render-after',
  () => <Extension />,
);

function Extension() {
  const [coupon, getCoupon] = useState('');
  const applyDiscountCodeChange = useApplyDiscountCodeChange();
  const [appliedCodes, setAppliedCodes] = useState([]);
  const { shop } = useApi();

  const updateCoupon = (value) => {
    getCoupon(value);
  }

  const applyDiscount = async () => {
    try {
      await fetch('https://farzipromoshopify.farziengineer.co/discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'code': coupon,
          'client': 'boat'
        })
      });
      await applyDiscountCodeChange({
        type: 'addDiscountCode',
        code: coupon
      });
      setAppliedCodes([...appliedCodes, coupon]);
    }
    catch (err) {
      console.log(err);
    }
  }

  const removeDiscount = async (coupon) => {
    try {
      await applyDiscountCodeChange({
        type: 'removeDiscountCode',
        code: coupon
      });
      setAppliedCodes(appliedCodes.filter(appliedCode => appliedCode !== coupon));
    }
    catch (err) {
      console.error(err);
    }
  }

  return (
    <BlockStack>
      <View border='base' padding='base'>
        <View padding='tight'>
          <Heading>Apply Discount Code</Heading>
        </View>
        <View padding='tight'>
          <Grid columns={['70%', 'fill', 'auto']} spacing='tight'>
            <TextField
              label='Enter Discount Code'
              onChange={(value) => updateCoupon(value)}
            />
            <Button kind='primary' appearance='monochrome' onPress={() => applyDiscount()}>
              Apply
            </Button>
          </Grid>
        </View>
        <InlineStack padding='tight'>
          {appliedCodes.map((coupon, index) => (
            <Banner
              key={index}
              status=''
              title={coupon}
              onDismiss={() => removeDiscount(coupon)}
            />
          ))}
        </InlineStack>
      </View>
    </BlockStack>
  );
}
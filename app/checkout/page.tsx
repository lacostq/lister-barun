'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { useCartStore } from '@/store/cart';
import { useLanguage } from '@/components/providers/language-provider';
import { getTranslation } from '@/lib/translations';
import { Check, ChevronRight, ChevronLeft, Package, DollarSign, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { language } = useLanguage();
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Switzerland',
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = getTotalPrice();
  const shippingCost = total >= 80 ? 0 : 8;
  const finalTotal = total + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.paymentMethod === 'credit_card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.cardName.trim()) newErrors.cardName = 'Card holder name is required';
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required';
      if (!formData.cardCvc.trim()) newErrors.cardCvc = 'CVC is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePlaceOrder = () => {
    toast.success('Order placed successfully! (Demo mode)');
    clearCart();
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-playfair text-4xl font-bold text-alpine-forest mb-8">
            {getTranslation('checkout.title', language)}
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors ${
                    s < step
                      ? 'bg-green-500'
                      : s === step
                        ? 'bg-alpine-forest'
                        : 'bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {s < step ? <Check className="w-6 h-6" /> : s}
                </motion.div>

                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="font-semibold text-alpine-forest">
                {getTranslation('checkout.step_1', language)}
              </p>
            </div>
            <div className="text-center">
              <p className={`font-semibold ${step >= 2 ? 'text-alpine-forest' : 'text-gray-500'}`}>
                {getTranslation('checkout.step_2', language)}
              </p>
            </div>
            <div className="text-center">
              <p className={`font-semibold ${step >= 3 ? 'text-alpine-forest' : 'text-gray-500'}`}>
                {getTranslation('checkout.step_3', language)}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8">
              {/* Step 1: Shipping Address */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="font-playfair text-2xl font-bold text-alpine-forest mb-6">
                    {getTranslation('checkout.step_1', language)}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getTranslation('checkout.first_name', language)}
                      </label>
                      <Input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? 'border-red-500' : ''}
                        placeholder="John"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getTranslation('checkout.last_name', language)}
                      </label>
                      <Input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? 'border-red-500' : ''}
                        placeholder="Doe"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getTranslation('checkout.email', language)}
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'border-red-500' : ''}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getTranslation('checkout.phone', language)}
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? 'border-red-500' : ''}
                        placeholder="+41 79 123 45 67"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getTranslation('checkout.address', language)}
                      </label>
                      <Input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={errors.address ? 'border-red-500' : ''}
                        placeholder="Rue de la Paix 123"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getTranslation('checkout.city', language)}
                      </label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={errors.city ? 'border-red-500' : ''}
                        placeholder="Fribourg"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getTranslation('checkout.postal_code', language)}
                      </label>
                      <Input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={errors.postalCode ? 'border-red-500' : ''}
                        placeholder="1700"
                      />
                      {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="font-playfair text-2xl font-bold text-alpine-forest mb-6">
                    {getTranslation('checkout.payment_method', language)}
                  </h2>

                  <div className="space-y-4 mb-8">
                    {[
                      { value: 'credit_card', label: getTranslation('checkout.credit_card', language) },
                      { value: 'paypal', label: getTranslation('checkout.paypal', language) },
                      { value: 'twint', label: getTranslation('checkout.twint', language) },
                      { value: 'bank_transfer', label: getTranslation('checkout.bank_transfer', language) },
                    ].map((method) => (
                      <label key={method.value} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={formData.paymentMethod === method.value}
                          onChange={handleInputChange}
                          className="w-4 h-4"
                        />
                        <span className="ml-3 font-medium text-gray-700">{method.label}</span>
                      </label>
                    ))}
                  </div>

                  {formData.paymentMethod === 'credit_card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <Input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="4532 1234 5678 9010"
                          className={errors.cardNumber ? 'border-red-500' : ''}
                        />
                        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name</label>
                        <Input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className={errors.cardName ? 'border-red-500' : ''}
                        />
                        {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                          <Input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className={errors.cardExpiry ? 'border-red-500' : ''}
                          />
                          {errors.cardExpiry && <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              name="cardCvc"
                              value={formData.cardCvc}
                              onChange={handleInputChange}
                              placeholder="123"
                              className={errors.cardCvc ? 'border-red-500' : ''}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {errors.cardCvc && <p className="text-red-500 text-sm mt-1">{errors.cardCvc}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'paypal' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-700">
                        You will be redirected to PayPal to complete your payment securely.
                      </p>
                    </div>
                  )}

                  {formData.paymentMethod === 'twint' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-700">
                        You will receive a TWINT payment link after order confirmation.
                      </p>
                    </div>
                  )}

                  {formData.paymentMethod === 'bank_transfer' && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm text-purple-700">
                        Bank transfer details will be provided after order confirmation.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Review Order */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="font-playfair text-2xl font-bold text-alpine-forest mb-6">
                    {getTranslation('checkout.review_order', language)}
                  </h2>

                  <div className="space-y-4 mb-8">
                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <p className="text-sm font-semibold text-blue-900 mb-2">Shipping Address</p>
                      <p className="text-sm text-blue-800">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-sm text-blue-800">{formData.address}</p>
                      <p className="text-sm text-blue-800">
                        {formData.postalCode} {formData.city}
                      </p>
                    </Card>

                    <Card className="p-4 bg-green-50 border-green-200">
                      <p className="text-sm font-semibold text-green-900 mb-2">Payment Method</p>
                      <p className="text-sm text-green-800 capitalize">
                        {formData.paymentMethod.replace('_', ' ')}
                      </p>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8 pt-8 border-t">
                {step > 1 && (
                  <Button
                    onClick={() => setStep(step - 1)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {getTranslation('checkout.back', language)}
                  </Button>
                )}

                {step < 3 && (
                  <Button
                    onClick={handleNext}
                    className="ml-auto flex items-center gap-2 bg-alpine-forest hover:bg-alpine-forest-dark text-white"
                  >
                    {getTranslation('checkout.continue', language)}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}

                {step === 3 && (
                  <Button
                    onClick={handlePlaceOrder}
                    className="ml-auto flex items-center gap-2 bg-alpine-forest hover:bg-alpine-forest-dark text-white"
                  >
                    {getTranslation('checkout.place_order', language)}
                    <Check className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 sticky top-20">
              <h3 className="font-playfair text-lg font-bold text-alpine-forest mb-4">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-gray-600">× {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">CHF {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">CHF {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">
                    {shippingCost === 0 ? 'Free' : `CHF ${shippingCost.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between">
                <span className="font-playfair font-bold text-alpine-forest">Total</span>
                <span className="font-playfair text-xl font-bold text-alpine-forest">
                  CHF {finalTotal.toFixed(2)}
                </span>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

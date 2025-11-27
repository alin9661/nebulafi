"use client"
import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Send, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Form submitted:', data);

    toast({
      title: 'Message Sent',
      description: 'Thank you for contacting us. We will get back to you soon.',
    });

    reset();
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in-up">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 uppercase tracking-tight">Get in Touch</h1>
              <p className="text-gray-400 font-mono text-sm leading-relaxed">
                Have questions about NebulaFi? We're here to help. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="space-y-6">
              <GlassCard className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg mb-1 uppercase tracking-wide">Email</h3>
                    <p className="text-gray-400 font-mono text-sm">support@nebulafi.io</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg mb-1 uppercase tracking-wide">Location</h3>
                    <p className="text-gray-400 font-mono text-sm">Global, Decentralized</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="font-display font-bold text-sm mb-3 uppercase tracking-widest">Response Time</h3>
              <p className="text-gray-400 font-mono text-sm leading-relaxed">
                We typically respond within 24-48 hours during business days. For urgent matters, please include "URGENT" in your message subject.
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <GlassCard className="p-8">
              <h2 className="text-2xl font-display font-bold mb-6 uppercase tracking-wide">Send a Message</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-mono uppercase tracking-widest text-gray-400">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    {...register('name')}
                    className={`bg-white/5 border-white/10 text-white font-mono placeholder:text-gray-600 focus:border-white/50 ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs font-mono">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-mono uppercase tracking-widest text-gray-400">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...register('email')}
                    className={`bg-white/5 border-white/10 text-white font-mono placeholder:text-gray-600 focus:border-white/50 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs font-mono">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs font-mono uppercase tracking-widest text-gray-400">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    rows={6}
                    {...register('message')}
                    className={`bg-white/5 border-white/10 text-white font-mono placeholder:text-gray-600 focus:border-white/50 resize-none ${
                      errors.message ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-xs font-mono">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-white text-black font-mono text-sm font-bold uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

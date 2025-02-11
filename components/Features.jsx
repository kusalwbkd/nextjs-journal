
import { Book, Lock, Sparkles } from 'lucide-react';
import React from 'react'
import { Card, CardContent } from './ui/card';

const features = [
    {
      icon: Book,
      title: "Rich Text Editor",
      description:
        "Express yourself with a powerful editor supporting markdown, formatting, and more.",
    },
    {
      icon: Sparkles,
      title: "Daily Inspiration",
      description:
        "Get inspired with daily prompts and mood-based imagery to spark your creativity.",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description:
        "Your thoughts are safe with enterprise-grade security and privacy features.",
    },
  ];

  
  const Features = () => {
    return (
        <section id="features" className='mt-24 grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
          <Card key={index} className="shadow-lg">
            <CardContent className="p-6">
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-xl text-orange-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-orange-700">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
        </section>
    )
  }
  
  export default Features
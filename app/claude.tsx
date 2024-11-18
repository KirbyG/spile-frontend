import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Twitter, Linkedin } from 'lucide-react';

const SpileLanding = () => {
  const founders = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-founder',
      bio: 'Former ML researcher at DeepMind, specialized in distributed systems and scalable AI infrastructure.',
      image: '/api/placeholder/300/300',
      twitter: '#',
      github: '#',
      linkedin: '#'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO & Co-founder',
      bio: 'Previously led engineering at Stripe. Expert in distributed systems and TypeScript.',
      image: '/api/placeholder/300/300',
      twitter: '#',
      github: '#',
      linkedin: '#'
    },
    {
      name: 'Alex Kim',
      role: 'Head of Product & Co-founder',
      bio: 'Product leader from Figma, passionate about developer tools and user experience.',
      image: '/api/placeholder/300/300',
      twitter: '#',
      github: '#',
      linkedin: '#'
    }
  ];

  const sampleCode = `
// Spile's distributed task scheduler
async function scheduleTask<T>(
  task: Task<T>,
  options: ScheduleOptions
): Promise<TaskResult<T>> {
  const cluster = await getOptimalCluster();
  const schedule = await generateSchedule(task, options);
  
  return await cluster.execute(schedule);
}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Distributed Computing,
          <span className="text-blue-600"> Simplified</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Spile makes distributed systems development as easy as writing local code.
          Scale your applications effortlessly with our next-generation framework.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Get Started
          </button>
          <button className="border border-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Read Docs
          </button>
        </div>
      </header>

      {/* Code Preview Section */}
      <section className="bg-gray-900 py-16 my-12">
        <div className="container mx-auto px-4">
          <div className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
            <pre className="text-gray-100 font-mono text-sm">
              {sampleCode}
            </pre>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {founders.map((founder) => (
            <Card key={founder.name} className="overflow-hidden">
              <img
                src={founder.image}
                alt={founder.name}
                className="w-full h-64 object-cover"
              />
              <CardHeader>
                <CardTitle>{founder.name}</CardTitle>
                <CardDescription>{founder.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{founder.bio}</p>
                <div className="flex gap-4">
                  <a href={founder.twitter} className="text-gray-600 hover:text-blue-500">
                    <Twitter size={20} />
                  </a>
                  <a href={founder.github} className="text-gray-600 hover:text-gray-900">
                    <Github size={20} />
                  </a>
                  <a href={founder.linkedin} className="text-gray-600 hover:text-blue-700">
                    <Linkedin size={20} />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Calendar Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">Book a Consultation</h2>
          <p className="text-center text-gray-600 mb-8">
            Schedule a call with our team to learn how Spile can help scale your infrastructure.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Calendar
              mode="single"
              className="rounded-md border"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Spile</h3>
              <p className="text-gray-400">
                Making distributed systems development accessible to everyone.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-400">hello@spile.tech</p>
              <p className="text-gray-400">San Francisco, CA</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white"><Twitter size={20} /></a>
                <a href="#" className="hover:text-white"><Github size={20} /></a>
                <a href="#" className="hover:text-white"><Linkedin size={20} /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; 2024 Spile. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SpileLanding;

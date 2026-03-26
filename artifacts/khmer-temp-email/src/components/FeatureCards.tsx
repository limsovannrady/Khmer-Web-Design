import { Zap, ShieldCheck, Coins } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Zap,
    title: "លឿនទាន់ចិត្ត",
    description: "ទទួលបានអ៊ីម៉ែលភ្លាមៗដោយគ្មានការពន្យារពេល។ ប្រអប់សំបុត្ររបស់អ្នកធ្វើបច្ចុប្បន្នភាពដោយស្វ័យប្រវត្តិ។",
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    icon: ShieldCheck,
    title: "ឯកជន និងមានសុវត្ថិភាព",
    description: "ការពារអាសយដ្ឋានអ៊ីម៉ែលពិតប្រាកដរបស់អ្នកពីសារឥតបានការ និងរក្សាភាពឯកជនរបស់អ្នកឲ្យមានសុវត្ថិភាព។",
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    icon: Coins,
    title: "ឥតគិតថ្លៃ ១០០%",
    description: "សេវាកម្មរបស់យើងគឺឥតគិតថ្លៃទាំងស្រុង ដោយមិនចាំបាច់ចុះឈ្មោះ ឬបញ្ចូលព័ត៌មានកាតឥណទានឡើយ។",
    color: "text-red-500",
    bg: "bg-red-500/10"
  }
];

export function FeatureCards() {
  return (
    <section className="py-24 bg-white/50 border-t border-border/50" id="features">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            ហេតុអ្វីគួរប្រើប្រាស់ <span className="text-primary">ដ្រម៉ែល</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            យើងផ្ដល់ជូននូវដំណោះស្រាយដ៏ល្អបំផុត ក្នុងការជួយអ្នកបញ្ចៀសពីសាររំខាននានាលើអ៊ីម៉ែលពិតរបស់អ្នក។
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card p-8 rounded-3xl border border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

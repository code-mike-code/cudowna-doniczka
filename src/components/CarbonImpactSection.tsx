import { Leaf, TreePine, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import {
  getDaysActive,
  totalCO2g,
  treeEquivalent,
  progressPercent,
} from '@/lib/carbonCalculator';

export interface PotData {
  mass_kg: number;
  model_type: 'S' | 'M' | 'L';
  color: string;
  production_date: string;
}

interface Props {
  potData?: PotData;
}

const MODEL_NAMES: Record<'S' | 'M' | 'L', string> = {
  S: 'Mała (S)',
  M: 'Średnia (M)',
  L: 'Duża (L)',
};

const EXAMPLE_DATA: PotData = {
  mass_kg: 1.2,
  model_type: 'M',
  color: 'naturalny',
  production_date: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0],
};

const CarbonImpactSection = ({ potData }: Props) => {
  const isExample = !potData;
  const data = potData ?? EXAMPLE_DATA;

  const days = getDaysActive(data.production_date);
  const co2g = totalCO2g(data.mass_kg, days);
  const co2Display =
    co2g >= 1000
      ? `${(co2g / 1000).toFixed(2)} kg`
      : `${co2g.toFixed(0)} g`;
  const trees = treeEquivalent(co2g);
  const progress = progressPercent(days);

  const { isVisible, ref } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  });

  return (
    <section id="carbon-impact" className="py-20 bg-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-fluid-3xl font-bold text-foreground mb-4">
            Wpływ na Klimat
          </h2>
          <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto">
            {isExample
              ? 'Przykład dla typowej Cudownej Doniczki M po 125 dniach od produkcji.'
              : `Twoja doniczka ${MODEL_NAMES[data.model_type]} w kolorze ${data.color}.`}
          </p>
          {isExample && (
            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Przykład
            </span>
          )}
        </div>

        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div
            className="bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/10 rounded-2xl p-6 text-center space-y-3"
            style={{ transitionDelay: '100ms' }}
          >
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{co2Display}</p>
            <p className="text-sm text-muted-foreground">pochłoniętego CO₂</p>
          </div>

          <div
            className="bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/10 rounded-2xl p-6 text-center space-y-3"
            style={{ transitionDelay: '200ms' }}
          >
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {days} / 250
            </p>
            <p className="text-sm text-muted-foreground mb-2">aktywnych dni</p>
            <Progress
              value={progress}
              className="h-2"
              aria-label={`${days} z ${MAX_ACTIVE_DAYS} aktywnych dni`}
            />
          </div>

          <div
            className="bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/10 rounded-2xl p-6 text-center space-y-3"
            style={{ transitionDelay: '300ms' }}
          >
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <TreePine className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {trees.toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">
              dni pracy dorosłego drzewa
            </p>
          </div>
        </div>

        {isExample && (
          <p className="text-center text-xs text-muted-foreground mt-8">
            Zeskanuj chip NFC na swojej doniczce, aby zobaczyć swój indywidualny wpływ.
          </p>
        )}
      </div>
    </section>
  );
};

export default CarbonImpactSection;

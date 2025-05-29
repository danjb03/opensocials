
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface R4Flag {
  key: string;
  value: boolean;
  description: string | null;
  updated_at: string;
}

export default function R4FlagsToggle() {
  const [flags, setFlags] = useState<R4Flag[]>([]);

  useEffect(() => {
    const fetchFlags = async () => {
      const { data, error } = await supabase.from('r4_flags').select('*');
      if (!error && data) {
        setFlags(data);
      }
    };
    fetchFlags();
  }, []);

  const handleToggle = async (key: string, current: boolean) => {
    const { error } = await supabase
      .from('r4_flags')
      .update({ value: !current, updated_at: new Date().toISOString() })
      .eq('key', key);

    if (!error) {
      setFlags(flags.map(flag =>
        flag.key === key ? { ...flag, value: !current } : flag
      ));
    }
  };

  return (
    <div className="grid gap-4 p-4">
      {flags.map(flag => (
        <div key={flag.key} className="flex items-center justify-between">
          <div>
            <Label>{flag.key}</Label>
            <p className="text-sm text-muted-foreground">{flag.description}</p>
          </div>
          <Switch 
            checked={flag.value} 
            onCheckedChange={() => handleToggle(flag.key, flag.value)} 
          />
        </div>
      ))}
    </div>
  );
}

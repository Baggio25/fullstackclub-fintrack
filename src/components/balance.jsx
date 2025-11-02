import { useQuery } from '@tanstack/react-query';
import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  Wallet,
} from 'lucide-react';
import { useSearchParams } from 'react-router';

import { useAuthContext } from '@/contexts/auth';
import { UserService } from '@/services/user';

import BalanceItem from './balance-item';

const Balance = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuthContext();
  const { data } = useQuery({
    queryKey: ['balance', user.id],
    queryFn: () => {
      const from = searchParams.get('from');
      const to = searchParams.get('to');

      return UserService.getBalance({ from, to });
    },
  });

  console.log(data);
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-6">
      <BalanceItem
        icon={<Wallet size={16} />}
        label="Saldo"
        amount={data?.balance}
      />
      <BalanceItem
        icon={<TrendingUpIcon className="text-primary-green" size={16} />}
        label="Ganhos"
        amount={data?.earnings}
      />
      <BalanceItem
        icon={<TrendingDownIcon className="text-primary-red" size={16} />}
        label="Gastos"
        amount={data?.expenses}
      />
      <BalanceItem
        icon={<PiggyBankIcon className="text-primary-blue" size={16} />}
        label="Investimentos"
        amount={data?.investments}
      />
    </div>
  );
};

export default Balance;

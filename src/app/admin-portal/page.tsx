import { redirect } from 'next/navigation';

export default function AdminPortalRedirectPage() {
  redirect('/admin-portal/projects');
}

